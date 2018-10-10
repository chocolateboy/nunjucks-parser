import avaTest from 'ava'
import Fs      from 'fs'
import Path    from 'path'

const testExtensions = {
    isHTML (got, want) {
        this.is(normalize(got), want)
    }
}

const self = {
    read (path) {
        const resolved = this.resolve(path)
        return Fs.readFileSync(resolved, 'utf8')
    },

    resolve (path) {
        return Path.resolve(__dirname, path)
    }
}

function wrap (callback) {
    return function (t) {
        Object.assign(t, testExtensions)
        return callback.call(this, t)
    }
}

// remove stray newlines from the rendered HTML to simplify diffing
function normalize (html) {
    return html.replace(/\n{2,}/g, "\n")
}

// a version of ava's `test` export which adds domain-specific methods to its
// `t` instance e.g. t.isHTML(...) i.e. a DWIM version of ava's "macros"
// XXX there may be a way to add these to the `t` object's prototype rather than
// assigning them to `t` on every call

const test = new Proxy(avaTest, {
    apply (target, $this, args) {
        args[args.length - 1] = wrap(args[args.length - 1])
        return Reflect.apply(avaTest, $this, args)
    }
})

export { self, test }
