import { parseFile, renderFile } from '..'
import { env, normalize, want }  from './_helpers.js'
import test                      from 'ava'
import { sprintf }               from 'sprintf-js'

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

test('caching', async t => {
    const One = function* (values) {
        yield values[0]

        while (true) {
            yield values[1]
        }
    }

    let content, result

    function options (head) {
        const tail = head === 'lhs' ? 'rhs' : 'lhs'
        const branch = One([head, tail])
        return { data: { branch } }
    }

    // first: prime the cache
    content = await renderFile(env.cache, 'index.html', options('lhs'))
    t.is(normalize(content), want.content.cache.lhs)

    // confirm parseFile bypasses the cache (lhs)
    result = await parseFile(env.cache, 'index.html', options('lhs'))
    t.is(normalize(result.content), want.content.cache.lhs)
    t.deepEqual(result.dependencies, want.dependencies.cache.lhs)

    // confirm parseFile bypasses the cache (rhs)
    result = await parseFile(env.cache, 'index.html', options('rhs'))
    t.is(normalize(result.content), want.content.cache.rhs)
    t.deepEqual(result.dependencies, want.dependencies.cache.rhs)
})
