module.exports = {
    env: {
        development: {
            sourceMaps: 'inline',
        }
    },

    presets: [
        ['@babel/preset-env', {
            corejs: 3,

            // only include polyfills if they're used
            useBuiltIns: 'usage',

            // set this to true to see the applied transforms and bundled polyfills
            debug: false,

            // https://jamie.build/last-2-versions
            targets: {
                browsers: ['>0.25%', 'not ie 11', 'not op_mini all'],
            },
        }]
    ],

    plugins: ['@babel/plugin-transform-runtime'],
}
