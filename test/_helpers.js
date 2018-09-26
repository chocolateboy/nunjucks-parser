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

const cacheDir = cwd('./cache')
const exampleDir = cwd('./example')

const cacheContentLhs = Fs.readFileSync(cwd('fixtures/content/cache-lhs.html'), 'utf8')
const cacheContentRhs = Fs.readFileSync(cwd('fixtures/content/cache-rhs.html'), 'utf8')
const cacheDependenciesLhs = cwd.require('fixtures/dependencies/cache-lhs.js')(cacheDir)
const cacheDependenciesRhs = cwd.require('fixtures/dependencies/cache-rhs.js')(cacheDir)
const cacheEnv = Nunjucks.configure(cacheDir)
const exampleContent = Fs.readFileSync(cwd('fixtures/content/example.html'), 'utf8')
const exampleEnv = Nunjucks.configure(exampleDir)
const fileDependencies = cwd.require('fixtures/dependencies/file.js')(exampleDir)
const layout = Fs.readFileSync(cwd('example/layout.html'), 'utf8')
const stringWithoutPathDependencies = cwd.require('fixtures/dependencies/string-without-path.js')(exampleDir)
const stringWithPathDependencies = cwd.require('fixtures/dependencies/string-with-path.js')(exampleDir)

const dependencies = {
    cache: {
        lhs: cacheDependenciesLhs,
        rhs: cacheDependenciesRhs,
    },
    file: fileDependencies,
    string: {
        path: stringWithPathDependencies,
        noPath: stringWithoutPathDependencies,
    }
}

const env = { example: exampleEnv, cache: cacheEnv }

const want = {
    content: {
        example: exampleContent,
        cache: {
            lhs: cacheContentLhs,
            rhs: cacheContentRhs,
        }
    },
    dependencies,
}

export { cwd, env, layout, normalize, want }
