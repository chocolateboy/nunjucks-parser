module.exports = templateDir => [
    {
        name: 'components/header.html',
        parent: `${templateDir}/layout.html`,
        path: `${templateDir}/components/header.html`
    },
    {
        name: 'components/footer.html',
        parent: `${templateDir}/layout.html`,
        path: `${templateDir}/components/footer.html`
    },
    {
        name: './copyright.txt',
        parent: `${templateDir}/components/footer.html`,
        path: `${templateDir}/components/copyright.txt`
    }
]
