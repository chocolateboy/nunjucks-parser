module.exports = templateDir => [
    {
        name: 'components/header.html',
        parent: null,
        path: `${templateDir}/components/header.html`
    },
    {
        name: 'components/footer.html',
        parent: null,
        path: `${templateDir}/components/footer.html`
    },
    {
        name: './copyright.txt',
        parent: `${templateDir}/components/footer.html`,
        path: `${templateDir}/components/copyright.txt`
    }
]
