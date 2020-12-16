const Path = require('path')

module.exports = templateDir => [
    {
        name: 'index.html',
        parent: null,
        path: Path.join(templateDir, 'index.html'),
    },
    {
        name: 'page-1.html',
        parent: Path.join(templateDir, 'index.html'),
        path: Path.join(templateDir, 'page-1.html'),
    },
    {
        name: 'page-3.html',
        parent: Path.join(templateDir, 'page-1.html'),
        path: Path.join(templateDir, 'page-3.html'),
    },
    {
        name: 'page-4.html',
        parent: Path.join(templateDir, 'page-3.html'),
        path: Path.join(templateDir, 'page-4.html'),
    },
    {
        name: 'page-2.html',
        parent: Path.join(templateDir, 'index.html'),
        path: Path.join(templateDir, 'page-2.html'),
    },
    {
        name: 'page-3.html',
        parent: Path.join(templateDir, 'page-2.html'),
        path: Path.join(templateDir, 'page-3.html'),
    },
    {
        name: 'page-5.html',
        parent: Path.join(templateDir, 'page-3.html'),
        path: Path.join(templateDir, 'page-5.html'),
    }
]
