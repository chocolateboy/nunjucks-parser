const { Template } = require('nunjucks')
const promisify    = require('pify')

// returns a wrapped version of Environment#getTemplate which appends the
// dependencies discovered during the course of its thread of execution (which
// may make nested calls to `getTemplate`) to the supplied array.
//
// before:
//
//    getTemplate (name, parent, data) {
//        const template = this._resolveTemplate(name, parent)
//        return template.render(data)
//    }
//
// after:
//
//    const dependencies = []
//
//    getTemplate (name, parent, data) {
//        const template = this._resolveTemplate(name, parent)
//        const result = template.render(data)
//        dependencies.push({ name, parent, path: result.path })
//        return result
//   }

function wrapGetTemplate (env, dependencies) {
    const oldGetTemplate = env.getTemplate

    // XXX everything here apart from the dependency signal is copypasta from
    // nunjucks.Environment (v3.x) and can go away if/when this data is exposed
    // by nunjucks e.g. via an event emitter:
    //
    // https://github.com/mozilla/nunjucks/issues/1153

    return function getTemplate (...args) {
        let [name, eagerCompile, parent, ignoreMissing, cb] = args
        let replace = 4

        if (name && name.raw) {
            name = name.raw
        }

        if (typeof parent === 'function') {
            cb = parent
            parent = null
            replace = 2
        }

        if (typeof eagerCompile === 'function') {
            cb = eagerCompile
            replace = 1
        }

        if (cb) {
            const originalCallback = cb
            const wrapper = (err, result) => {
                if (!err) {
                    dependencies.push({
                        name,
                        parent: parent || null,
                        path: result.path,
                    })
                }

                return originalCallback(err, result)
            }

            args[replace] = wrapper
        }

        const result = oldGetTemplate.apply(this, args)

        if (!cb) {
            dependencies.push({
                name,
                parent: parent || null,
                path: result.path,
            })
        }

        return result
    }
}

// a version of Environment#render which is (always) async and which
// is passed the data via an options object
async function renderFile (env, templatePath, _options) {
    const options = _options || {}
    const getTemplate = promisify(env.getTemplate.bind(env))
    const template = await getTemplate(templatePath)
    const render = promisify(template.render.bind(template))

    return render(options.data)
}

// a version of Environment#renderString which is (always) async and which
// is passed the data and path via an options object
function renderString (env, src, _options) {
    const options = _options || {}
    const template = new Template(src, env, options.path)
    const render = promisify(template.render.bind(template))

    return render(options.data)
}

// `parseFile` and `parseString` are versions of `Environment#render` and
// `Environment#renderString`, respectively, which augment their results with an
// array of the transitive dependencies (templates) discovered during the course
// of their execution
//
// the underlying method in the `render` functions is `Environment#getTemplate`,
// which is called explicitly by `renderFile`, but also from generated/compiled
// code in nested templates.
//
// calls to `getTemplate` can be executed concurrently (i.e. interleaved) e.g.
// while one call is waiting for a network resource, another can run and return
// immediately with a precompiled result. this means we can't use the start and
// end of the method call to delimit its execution: other invocations of the
// method may happen during that window.
//
// for the same reason, the state can't be a property of the Environment
// instance, i.e. of `this`, as that may be shared across multiple invocations.
//
// one way to scope state to a method call is to pass the state into and down
// from the call as a parameter e.g.:
//
//    getTemplate (state, name, parent, data) {
//        const template = this._resolveTemplate(state, name)
//        const result = template.render(data)
//        state.dependencies.push({ name, parent, path: template.path })
//        return result
//    }
//
//    const state = { dependencies: [] }
//    const result = env.getTemplate(state, name, parent, data)
//    console.log(state.dependencies)
//
// this works but it's hugely disruptive, requiring changes not only to the
// signature and internals of `getTemplate` but to any method it calls that
// might lead to a nested `getTemplate` call. this solution is particularly
// impractical for nunjucks since these calls may be baked into compiled code,
// which can't be "upgraded" to support a new protocol for "thread local" [1]
// (i.e. per method-call) state.
//
// a better solution is to avoid concurrency/mutation altogether. we can do this
// by creating a private clone of the Environment and calling `getTemplate` on
// that. because it's private, nothing in the outside world can access or mutate
// it. because it's a clone, it won't modify anything in the outside world.
//
//    const dependencies = []
//    const clone = env.clone()
//    clone.getTemplate = wrapGetTemplate(env, dependencies)
//    const result = clone.getTemplate(name, parent, data)
//    console.log(dependencies)
//
// the "viral" nature of the hidden `this` parameter means the clone will get
// passed down to nested `getTemplate` calls, which is just what we want: things
// outside the bubble of encapsulation stay outside and things inside the bubble
// stay inside.
//
// the only drawback with this approach is that we lose things from the original
// env that we don't need to jettison. in order to harvest dependencies, the
// only things we need to override are `getTemplate` and caching. everything
// else can be delegated to the original env.
//
// this suggests that we don't need an Environment#clone method after all (which
// is just as well since nunjucks doesn't provide one — yet [2]). Our temporary
// env is not so much a clone as a *shim*, an object that delegates almost
// everything to its target. as of ES6, we have a built-in way to create shims
// like this quickly and easily without waiting for a library to bless us with a
// (potentially much heavier) `clone` implementation:
//
//    const dependencies = []
//    const getTemplate = wrapGetTemplate(env, dependencies)
//    const get = (target, name) => name === 'getTemplate' ? getTemplate : ...
//    const shim = new Proxy(env, { get })
//    const result = shim.getTemplate(name, parent, data)
//    console.log(dependencies)
//
// note that using a shim in this way is equivalent to the original solution of
// passing down an extra state parameter: it's just passed down
// implicitly/automatically as the hidden `this` parameter, rather than as an
// explicit parameter, which sidesteps the API compatibility issues.
//
// this technique also scales well if the implementation changes e.g. it's easy
// to collect dependencies emitted via an event emitter [3] by replacing the
// shim's `getTemplate` override with an `emit` override
//
// [1] AKA "continuation local": https://github.com/othiym23/node-continuation-local-storage
// [2] https://github.com/mozilla/nunjucks/pull/897
// [3] https://github.com/mozilla/nunjucks/issues/1153

// a private helper implementing code common to `parseFile` and `parseString`
async function parse (env, render, pathOrSource, _options) {
    const options = _options || {}
    const dependencies = []
    const getTemplate = wrapGetTemplate(env, dependencies)

    // we need to disable caching (thread-locally) in order to traverse all of
    // the descendant files
    const fakeLoaders = env.loaders.map(loader => {
        // despite environments having a noCache option, it's effectively
        // ignored in nunjucks, and all cache operations are performed by
        // reading from and writing to env.loaders[*].cache. by intercepting
        // this property, we can return false for all cache probes, ensuring
        // dynamic dependencies are always reached
        return new Proxy(loader, {
            get (target, name, receiver) {
                return (name === 'cache') ? {} : Reflect.get(target, name, receiver)
            }
        })
    })

    // override `getTemplate` and inject the wrappers we use to (thread-locally)
    // void the loaders' caches
    const shim = new Proxy(env, {
        get (target, name, receiver) {
            if (name === 'getTemplate') {
                return getTemplate
            } else if (name === 'loaders') {
                return fakeLoaders
            } else {
                const result = Reflect.get(target, name, receiver)
                return (result === target) ? receiver : result
            }
        }
    })

    const content = await render(shim, pathOrSource, options)

    return { content, dependencies }
}

// an enhanced version of `renderFile` which augments its result with an array
// of the template's dependencies
function parseFile (env, templatePath, options) {
    return parse(env, renderFile, templatePath, options)
}

// an enhanced version of `renderString` which augments its result with an array
// of the template's dependencies
function parseString (env, src, options) {
    return parse(env, renderString, src, options)
}

module.exports = { parseFile, parseString, renderFile, renderString }
