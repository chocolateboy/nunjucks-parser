import { renderFile } from '..'
import test          from 'ava'
import { sprintf }   from 'sprintf-js'

import { env, normalize, want } from './_helpers.js'

test('renderFile (without data)', async t => {
    const content = normalize(await renderFile(env, 'layout.html'))
    t.is(content, sprintf(want.content, 'world'))
})

test('renderFile (with data)', async t => {
    const data = { name: 'nunjucks' }
    const content = normalize(await renderFile(env, 'layout.html', { data }))
    t.is(content, sprintf(want.content, 'nunjucks'))
})
