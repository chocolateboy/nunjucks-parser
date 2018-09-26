import { renderFile }           from '..'
import { env, normalize, want } from './_helpers.js'
import test                     from 'ava'
import { sprintf }              from 'sprintf-js'

test('renderFile (without data)', async t => {
    const content = await renderFile(env.example, 'layout.html')
    t.is(normalize(content), sprintf(want.content.example, 'world'))
})

test('renderFile (with data)', async t => {
    const data = { name: 'nunjucks' }
    const content = await renderFile(env.example, 'layout.html', { data })
    t.is(normalize(content), sprintf(want.content.example, 'nunjucks'))
})
