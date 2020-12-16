const Path = require('path')

module.exports = templateDir => [
    {
        name: 'components/header.html',
        parent: Path.join(templateDir, 'layout.html'),
        path: Path.join(templateDir, 'components/header.html'),
    },
    {
        name: 'components/footer.html',
        parent: Path.join(templateDir, 'layout.html'),
        path: Path.join(templateDir, 'components/footer.html'),
    },
    {
        name: './copyright.txt',
        parent: Path.join(templateDir, 'components/footer.html'),
        path: Path.join(templateDir, 'components/copyright.txt'),
    }
]
