import { parseFile }            from '..'
import { env, normalize, want } from './_helpers.js'
import test                     from 'ava'
import { sprintf }              from 'sprintf-js'

test('parseFile (without data)', async t => {
    const result = await parseFile(env.example, 'layout.html')

    t.is(normalize(result.content), sprintf(want.content.example, 'world'))
    t.deepEqual(result.dependencies, want.dependencies.file)
})

test('parseFile (with data)', async t => {
    const data = { name: 'nunjucks' }
    const result = await parseFile(env.example, 'layout.html', { data })

    t.is(normalize(result.content), sprintf(want.content.example, 'nunjucks'))
    t.deepEqual(result.dependencies, want.dependencies.file)
})
