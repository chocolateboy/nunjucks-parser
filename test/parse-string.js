import { parseString }                       from '..'
import { cwd, env, layout, normalize, want } from './_helpers.js'
import test                                  from 'ava'
import { sprintf }                           from 'sprintf-js'

const templatePath = cwd('example/layout.html')

test('parseString (without data, without path)', async t => {
    const result = await parseString(env.example, layout)

    t.is(normalize(result.content), sprintf(want.content.example, 'world'))
    t.deepEqual(result.dependencies, want.dependencies.string.noPath)
})

test('parseString (without data, with path)', async t => {
    const result = await parseString(env.example, layout, { path: templatePath })

    t.is(normalize(result.content), sprintf(want.content.example, 'world'))
    t.deepEqual(result.dependencies, want.dependencies.string.path)
})

test('parseString (with data, without path)', async t => {
    const data = { name: 'nunjucks' }
    const result = await parseString(env.example, layout, { data })

    t.is(normalize(result.content), sprintf(want.content.example, 'nunjucks'))
    t.deepEqual(result.dependencies, want.dependencies.string.noPath)
})

test('parseString (with data, with path)', async t => {
    const data = { name: 'nunjucks' }
    const result = await parseString(env.example, layout, { data, path: templatePath })

    t.is(normalize(result.content), sprintf(want.content.example, 'nunjucks'))
    t.deepEqual(result.dependencies, want.dependencies.string.path)
})
