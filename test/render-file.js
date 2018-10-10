import { renderFile } from '..'
import { self, test } from './_helpers.js'
import Nunjucks       from 'nunjucks'
import { sprintf }    from 'sprintf-js'

const templateDir = self.resolve('./example')
const wantContent = self.read('./fixtures/content/example.html')
const env = Nunjucks.configure(templateDir)

test('renderFile (without data)', async t => {
    const wantHTML = sprintf(wantContent, 'world')
    const content = await renderFile(env, 'layout.html')

    t.isHTML(content, wantHTML)
})

test('renderFile (with data)', async t => {
    const data = { name: 'nunjucks' }
    const wantHTML = sprintf(wantContent, 'nunjucks')
    const content = await renderFile(env, 'layout.html', { data })

    t.isHTML(content, wantHTML)
})
