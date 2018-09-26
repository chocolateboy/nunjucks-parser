import { renderString }                      from '..'
import { cwd, env, layout, normalize, want } from './_helpers.js'
import test                                  from 'ava'
import { sprintf }                           from 'sprintf-js'

const templatePath = cwd('example/layout.html')

test('renderString (without data, without path)', async t => {
    const content = await renderString(env.example, layout)
    t.is(normalize(content), sprintf(want.content.example, 'world'))
})

test('renderString (without data, with path)', async t => {
    const content = await renderString(env.example, layout, { path: templatePath })
    t.is(normalize(content), sprintf(want.content.example, 'world'))
})

test('renderString (with data, without path)', async t => {
    const data = { name: 'nunjucks' }
    const content = await renderString(env.example, layout, { data })
    t.is(normalize(content), sprintf(want.content.example, 'nunjucks'))
})

test('renderString (with data, with path)', async t => {
    const data = { name: 'nunjucks' }
    const content = await renderString(env.example, layout, { data, path: templatePath })
    t.is(normalize(content), sprintf(want.content.example, 'nunjucks'))
})
