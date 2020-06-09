// 这个文件只是用来让webstorm可以识别 @ ~ 文件的，没有别的什么用处
// 需要在websotmr里面添加webpack配置文件指定为该文件

const path = require('path')

module.exports = {
  resolve: {
    extensions: ['.js', '.json', '.vue', '.ts'],
    root: path.resolve(__dirname),
    alias: {
      '@': path.resolve(__dirname),
      '~': path.resolve(__dirname)
    }
  }
}
