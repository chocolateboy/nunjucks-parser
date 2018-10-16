import { parseFile }  from '..'
import { self, test } from './_helpers.js'
import Nunjucks       from 'nunjucks'
import { sprintf }    from 'sprintf-js'

const templateDir = self.resolve('./example')
const wantContent = self.read('./fixtures/content/example.html')
const wantDependencies = require('./fixtures/dependencies/file.js')(templateDir)
const env = Nunjucks.configure(templateDir)

test('parseFile (without data)', async t => {
    const wantHTML = sprintf(wantContent, 'world')
    const result = await parseFile(env, 'layout.html')

    t.isHTML(result.content, wantHTML)
    t.deepEqual(result.dependencies, wantDependencies)
})

test('parseFile (with data)', async t => {
    const data = { name: 'nunjucks' }
    const wantHTML = sprintf(wantContent, 'nunjucks')
    const result = await parseFile(env, 'layout.html', { data })

    t.isHTML(result.content, wantHTML)
    t.deepEqual(result.dependencies, wantDependencies)
})
