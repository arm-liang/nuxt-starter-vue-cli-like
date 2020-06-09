# nuxt-starter-vue-cli-like

1. 基于nuxt创建的一个初始化项目，项目结构和vue-cli相似，拥有env环境变量，设置有webpack缓存组和postcss
2. 添加axios服务端和浏览器端兼容
3. 自定义element-ui主题，element-ui按需导入组件
4. 接口代理

## 说明
1. element-ui 官网只提供了两种方式来自定义主题，第一种方式不能实现按需导入然后自定义主题，第二种方式node版本太低已经不再兼容
2. 我们直接修改element-ui babel插件直接导入scss文件然后修改主题，需要修改源码
3. 集成dotenv环境和接口代理，接口代理只有在开发环境下才使用
4. 推荐使用webstorm开发，而且开发的时候时候不要把.nuxt设置为exclude，不然可能无法识别nuxt-link等组件
