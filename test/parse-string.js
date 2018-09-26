import { parseString } from '..'
import test        from 'ava'
import { sprintf } from 'sprintf-js'

import { cwd, env, layout, normalize, want } from './_helpers.js'
const templatePath = cwd('example/layout.html')

test('parseString (without data, without path)', async t => {
    const result = await parseString(env, layout)
    const content = normalize(result.content)

    t.is(content, sprintf(want.content, 'world'))
    t.deepEqual(result.dependencies, want.stringDependencies.withoutPath)
})

test('parseString (without data, with path)', async t => {
    const result = await parseString(env, layout, { path: templatePath })
    const content = normalize(result.content)

    t.is(content, sprintf(want.content, 'world'))
    t.deepEqual(result.dependencies, want.stringDependencies.withPath)
})

test('parseString (with data, without path)', async t => {
    const data = { name: 'nunjucks' }
    const result = await parseString(env, layout, { data })
    const content = normalize(result.content)

    t.is(content, sprintf(want.content, 'nunjucks'))
    t.deepEqual(result.dependencies, want.stringDependencies.withoutPath)
})

test('parseString (with data, with path)', async t => {
    const data = { name: 'nunjucks' }
    const result = await parseString(env, layout, { data, path: templatePath })
    const content = normalize(result.content)

    t.is(content, sprintf(want.content, 'nunjucks'))
    t.deepEqual(result.dependencies, want.stringDependencies.withPath)
})
