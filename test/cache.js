const Nunjucks                  = require('nunjucks')
const { parseFile, renderFile } = require('..')
const { self, test }            = require('./_helpers.js')

// ensure all descendants are reached (i.e. caching is disabled) by ensuring we
// reach page-4 and page-5 in the following graph where page-3 loads page-4 the
// first time and page-5 the second time:
//
//                     index
//                    /      \
//                   /        \
//                  /          \
//                 /            \
//              page-1        page-2
//                \              /
//                 \            /
//                  \          /
//                   \        /
//                     page-3
//                    /      \
//                   /        \
//                  /          \
//                 /            \
//                /              \
//               page-4      page-5
//
// templates are traversed in depth-first order, so the result should be:
//
//     index -> page-1 -> page-3 -> page-4 -> page-2 -> page-3 -> page-5

const templateDir = self.resolve('./cache')
const contentLhs = self.read('./fixtures/content/cache-lhs.html')
const contentRhs = self.read('./fixtures/content/cache-rhs.html')
const dependenciesLhs = require('./fixtures/dependencies/cache-lhs.js')(templateDir)
const dependenciesRhs = require('./fixtures/dependencies/cache-rhs.js')(templateDir)
const env = Nunjucks.configure(templateDir)

// takes a generator and returns a function which yields a value from the
// generator each time it's called
function iterator (generator) {
    return () => generator.next().value
}

// a generator which yields its first value the first time it's called and
// its second value the second time it's called
function* select (head, tail) {
    yield* [head, tail]
}

// create options objects with a `data.branch` property (a function)
// which returns its first value the first time it's called and its second
// value the second time it's called.
// used to select left and right branches for the conditional load in the
// template
const selectLeftBranch = () => ({ data: { branch: iterator(select('lhs', 'rhs')) } })
const selectRightBranch = () => ({ data: { branch: iterator(select('rhs', 'lhs')) } })

test('caching', async t => {
    let content, result

    // first: prime the cache
    content = await renderFile(env, 'index.html', selectLeftBranch())
    t.isHTML(content, contentLhs)

    // confirm parseFile bypasses the cache (lhs)
    result = await parseFile(env, 'index.html', selectLeftBranch())
    t.isHTML(result.content, contentLhs)
    t.deepEqual(result.dependencies, dependenciesLhs)

    // confirm parseFile bypasses the cache (rhs)
    result = await parseFile(env, 'index.html', selectRightBranch())
    t.isHTML(result.content, contentRhs)
    t.deepEqual(result.dependencies, dependenciesRhs)
})
