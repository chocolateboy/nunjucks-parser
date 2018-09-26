import { renderString } from '..'
import test        from 'ava'
import { sprintf } from 'sprintf-js'

import { cwd, env, layout, normalize, want } from './_helpers.js'
const templatePath = cwd('example/layout.html')

test('renderString (without data, without path)', async t => {
    const content = normalize(await renderString(env, layout))
    t.is(content, sprintf(want.content, 'world'))
})

test('renderString (without data, with path)', async t => {
    const content = normalize(await renderString(env, layout, { path: templatePath }))
    t.is(content, sprintf(want.content, 'world'))
})

test('renderString (with data, without path)', async t => {
    const data = { name: 'nunjucks' }
    const content = normalize(await renderString(env, layout, { data }))
    t.is(content, sprintf(want.content, 'nunjucks'))
})

test('renderString (with data, with path)', async t => {
    const data = { name: 'nunjucks' }
    const content = normalize(await renderString(env, layout, { data, path: templatePath }))
    t.is(content, sprintf(want.content, 'nunjucks'))
})
