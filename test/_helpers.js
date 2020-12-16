const test           = require('ava')
const { Assertions } = require('ava/lib/assert.js')
const Fs             = require('fs')
const Path           = require('path')

// remove stray newlines from the rendered HTML to simplify diffing
function normalize (html) {
    return html.replace(/(?:\r?\n)+/g, '\n')
}

// XXX temporary hack to add methods to AVA's `t` object until official support
// for custom assertions is added: https://github.com/avajs/ava/issues/1094
Object.assign(Assertions.prototype, {
    isHTML (got, want) {
        this.is(normalize(got), want)
    }
})

// exported helper methods
const self = {
    read (path) {
        const resolved = this.resolve(path)
        const content = Fs.readFileSync(resolved, 'utf8')
        return content.replace(/\r\n/g, '\n')
    },

    resolve (path) {
        return Path.resolve(__dirname, path)
    }
}

module.exports = { self, test }
