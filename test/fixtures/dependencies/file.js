const Path = require('path')

module.exports = templateDir => [
    {
        name: 'layout.html',
        path: Path.join(templateDir, 'layout.html'),
        parent: null
    },
    {
        name: 'components/header.html',
        path: Path.join(templateDir, 'components/header.html'),
        parent: Path.join(templateDir, 'layout.html'),
    },
    {
        name: 'components/footer.html',
        path: Path.join(templateDir, 'components/footer.html'),
        parent: Path.join(templateDir, 'layout.html'),
    },
    {
        name: './copyright.txt',
        path: Path.join(templateDir, 'components/copyright.txt'),
        parent: Path.join(templateDir, 'components/footer.html'),
    }
]
