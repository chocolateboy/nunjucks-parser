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
            debug: process.env.NODE_ENV === 'development',

            // the targets are defined in pkg.browserslist, and are a tweaked
            // version of: https://jamie.build/last-2-versions
        }]
    ],

    plugins: ['@babel/plugin-transform-runtime'],
}
