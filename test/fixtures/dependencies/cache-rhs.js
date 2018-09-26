module.exports = templateDir => [
    {
        name: 'index.html',
        parent: null,
        path: `${templateDir}/index.html`
    },
    {
        name: 'page-1.html',
        parent: `${templateDir}/index.html`,
        path: `${templateDir}/page-1.html`
    },
    {
        name: 'page-3.html',
        parent: `${templateDir}/page-1.html`,
        path: `${templateDir}/page-3.html`
    },
    {
        name: 'page-5.html',
        parent: `${templateDir}/page-3.html`,
        path: `${templateDir}/page-5.html`
    },
    {
        name: 'page-2.html',
        parent: `${templateDir}/index.html`,
        path: `${templateDir}/page-2.html`
    },
    {
        name: 'page-3.html',
        parent: `${templateDir}/page-2.html`,
        path: `${templateDir}/page-3.html`
    },
    {
        name: 'page-4.html',
        parent: `${templateDir}/page-3.html`,
        path: `${templateDir}/page-4.html`
    }
]
