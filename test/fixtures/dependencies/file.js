module.exports = templateDir => [
    {
        name: 'layout.html',
        path: `${templateDir}/layout.html`,
        parent: null
    },
    {
        name: 'components/header.html',
        path: `${templateDir}/components/header.html`,
        parent: `${templateDir}/layout.html`
    },
    {
        name: 'components/footer.html',
        path: `${templateDir}/components/footer.html`,
        parent: `${templateDir}/layout.html`
    },
    {
        name: './copyright.txt',
        path: `${templateDir}/components/copyright.txt`,
        parent: `${templateDir}/components/footer.html`
    }
]
