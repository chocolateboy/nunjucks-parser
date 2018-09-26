import { parseFile } from '..'
import test          from 'ava'
import { sprintf }   from 'sprintf-js'

import { env, normalize, want } from './_helpers.js'

test('parseFile (without data)', async t => {
    const result = await parseFile(env, 'layout.html')
    const content = normalize(result.content)

    t.is(content, sprintf(want.content, 'world'))
    t.deepEqual(result.dependencies, want.fileDependencies)
})

test('parseFile (with data)', async t => {
    const data = { name: 'nunjucks' }
    const result = await parseFile(env, 'layout.html', { data })
    const content = normalize(result.content)

    t.is(content, sprintf(want.content, 'nunjucks'))
    t.deepEqual(result.dependencies, want.fileDependencies)
})
