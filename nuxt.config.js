// eslint-disable-next-line nuxt/no-cjs-in-config
const path = require('path')
const NODE_ENV = process.env.NODE_ENV
const resolve = p => path.resolve(__dirname, p)

export default {
  mode: 'universal',
  vue: {
    config: {
      productionTip: false
    }
  },
  server: {
    port: 3002
  },
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#d46b6b' },
  /*
  ** Global CSS
  */
  css: [],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    'plugins/element'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/dotenv-module
    ['@nuxtjs/dotenv', {
      filename: '.env.' + NODE_ENV
    }],
    // 手动添加，proxy代理，在解析 dotenv 之后通过环境变量添加代理
    function() {
      const options = this.options
      const env = options.env
      if (options.dev) {
        const moduleFun = require('@nuxtjs/proxy')
        options.proxy = {
          [env.VUE_APP_BASE_API]: {
            target: env.VUE_MOCK_PROXY,
            changeOrigin: true,
            cookieDomainRewrite: '*',
            cookiePathRewrite: {
              '*': '/'
            },
            pathRewrite: {
              [env.VUE_APP_BASE_API]: ''
            }
          }
        }
        moduleFun.call(this, options)
      }
      // '@nuxtjs/proxy',
    }
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // 开发环境下启动 cheap-source-map
      if (ctx.isDev) {
        config.devtool = 'cheap-source-map'
      }
    },
    // 使用babel转义element-ui
    transpile: /element-ui/,
    babel: {
      plugins: [
        ['component',
          {
            // 动态导入scss样式，然后直接修改源码实现换主题，修改的样式在 assets/element-variables.scss 有声明
            libraryName: 'element-ui',
            libDir: 'packages',
            styleLibraryName: 'theme-chalk/src',
            ext: '.scss'
          }
        ]
      ]
    },
    postcss: {
      plugins: {},
      preset: {
        autoprefixer: {
          grid: true
        }
      }
    },
    optimizeCSS: {},
    optimization: {
      splitChunks: {
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial'
          },
          'element-ui': {
            test: /[\\/]node_modules[\\/]element-ui/,
            priority: 20
          },
          common: {
            test: resolve('components'),
            minChunks: 3,
            priority: 5,
            reuseExistingChunk: true
          }
        }
      }
    }
  }
}
