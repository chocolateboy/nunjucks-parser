import { parseString } from '..'
import { self, test }  from './_helpers.js'
import Nunjucks        from 'nunjucks'
import { sprintf }     from 'sprintf-js'

const templateDir = self.resolve('./example')
const templatePath = `${templateDir}/layout.html`
const template = self.read(templatePath)
const wantContent = self.read('./fixtures/content/example.html')
const stringNoPathDependencies = require('./fixtures/dependencies/string-without-path.js')(templateDir)
const stringPathDependencies = require('./fixtures/dependencies/string-with-path.js')(templateDir)
const env = Nunjucks.configure(templateDir)

test('parseString (without data, without path)', async t => {
    const wantHTML = sprintf(wantContent, 'world')
    const result = await parseString(env, template)

    t.isHTML(result.content, wantHTML)
    t.deepEqual(result.dependencies, stringNoPathDependencies)
})

test('parseString (without data, with path)', async t => {
    const wantHTML = sprintf(wantContent, 'world')
    const result = await parseString(env, template, { path: templatePath })

    t.isHTML(result.content, wantHTML)
    t.deepEqual(result.dependencies, stringPathDependencies)
})

test('parseString (with data, without path)', async t => {
    const data = { name: 'nunjucks' }
    const wantHTML = sprintf(wantContent, 'nunjucks')
    const result = await parseString(env, template, { data })

    t.isHTML(result.content, wantHTML)
    t.deepEqual(result.dependencies, stringNoPathDependencies)
})

test('parseString (with data, with path)', async t => {
    const data = { name: 'nunjucks' }
    const wantHTML = sprintf(wantContent, 'nunjucks')
    const result = await parseString(env, template, { data, path: templatePath })

    t.isHTML(result.content, wantHTML)
    t.deepEqual(result.dependencies, stringPathDependencies)
})
