import Fs       from 'fs'
import Nunjucks from 'nunjucks'
import Path     from 'path'

// return the absolute path of the supplied file/directory name relative to the
// current directory (__dirname)
function cwd (path) {
    return Path.join(__dirname, path)
}

// shortcut for require(cwd(path))
cwd.require = function (path) {
    return require(this(path))
}

// remove stray newlines from the rendered HTML to simplify diffing
function normalize (html) {
    return html.replace(/\n{2,}/g, "\n")
}

const templateDir = cwd('./example')
const env = Nunjucks.configure(templateDir)
const content = Fs.readFileSync(cwd('fixtures/content.html'), 'utf8')
const fileDependencies = cwd.require('fixtures/dependencies/file.js')(templateDir)
const stringWithPathDependencies = cwd.require('fixtures/dependencies/string-with-path.js')(templateDir)
const stringWithoutPathDependencies = cwd.require('fixtures/dependencies/string-without-path.js')(templateDir)
const layout = Fs.readFileSync(cwd('example/layout.html'), 'utf8')
const want = {
    content,
    fileDependencies,
    stringDependencies: {
        withPath: stringWithPathDependencies,
        withoutPath: stringWithoutPathDependencies,
    }
}

export { cwd, env, layout, normalize, want }
