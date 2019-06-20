import test           from 'ava'
import { Assertions } from 'ava/lib/assert.js'
import Fs             from 'fs'
import Path           from 'path'

// remove stray newlines from the rendered HTML to simplify diffing
function normalize (html) {
    return html.replace(/\n{2,}/g, "\n")
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
        return Fs.readFileSync(resolved, 'utf8')
    },

    resolve (path) {
        return Path.resolve(__dirname, path)
    }
}

export { self, test }
