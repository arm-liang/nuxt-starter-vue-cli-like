module.exports = {
  apps: [{
    name: 'nuxt-test',
    script: 'node_modules/nuxt/bin/nuxt.js',
    args: 'start --port=3003',
    watch: '.nuxt/dist'
  }]
}
