import "vue-tsx-support/enable-check"
const nodeExternals = require('webpack-node-externals')

module.exports = {
    srcDir: 'src/',
    router: {
        mode: "hash",
    },
    head: {
        title: 'io-board forms',
    },
    manifest: {
        name: 'IO-Board Content Editor',
        short_name: 'io-board editor'
    },
    meta: {
        name: 'io-board',
        description: 'Declarative input forms for serverless',
        themeColor: '#ffffff',
        msTileColor: '#f87f2e',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: '#344675',
        workboxPluginMode: 'GenerateSW',
    },

    buildModules: [
        // Simple usage
        '@nuxtjs/vuetify',

        // With options
        // ['@nuxtjs/vuetify', { /* module options */ }]
        '@nuxt/typescript-build'
    ],
    vuetify: {
        /* module options */
        theme: {
            dark: true,
        },
    },
    build: {

        parallel: true,
        transpile: [/^vuetify/],
        extend(config, { isDev, isClient }) {

            if (!isDev) {
                // relative links, please.
                config.output.publicPath = './_nuxt/'
            }

            if (process.server) {
                config.externals = [
                    nodeExternals({
                        whitelist: [/^vuetify/]
                    })
                ]
            }
        }
    }

}