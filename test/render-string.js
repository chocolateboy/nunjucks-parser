const Nunjucks         = require('nunjucks')
const { sprintf }      = require('sprintf-js')
const { renderString } = require('..')
const { self, test }   = require('./_helpers.js')

const templateDir = self.resolve('./example')
const templatePath = `${templateDir}/layout.html`
const template = self.read(templatePath)
const wantContent = self.read('./fixtures/content/example.html')
const env = Nunjucks.configure(templateDir)

test('renderString (without data, without path)', async t => {
    const wantHTML = sprintf(wantContent, 'world')
    const content = await renderString(env, template)

    t.isHTML(content, wantHTML)
})

test('renderString (without data, with path)', async t => {
    const wantHTML = sprintf(wantContent, 'world')
    const content = await renderString(env, template, { path: templatePath })

    t.isHTML(content, wantHTML)
})

test('renderString (with data, without path)', async t => {
    const data = { name: 'nunjucks' }
    const wantHTML = sprintf(wantContent, 'nunjucks')
    const content = await renderString(env, template, { data })

    t.isHTML(content, wantHTML)
})

test('renderString (with data, with path)', async t => {
    const data = { name: 'nunjucks' }
    const wantHTML = sprintf(wantContent, 'nunjucks')
    const content = await renderString(env, template, { data, path: templatePath })

    t.isHTML(content, wantHTML)
})
