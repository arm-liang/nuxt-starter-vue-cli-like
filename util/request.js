import axios from 'axios'
import qs from 'qs'
import { Message, Loading } from 'element-ui'

// create an axios instance
const service = axios.create({
  // baseURL根据运行环境来自动设置
  // baseURL: process.env.VUE_APP_BASE_API,
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5 * 1000, // request timeout,
  // 发送的数据格式是表单格式，而不是JSON格式
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  // 设置request的解析使用querystring，运行 dot 点号，springmvc才能识别对象数组
  transformRequest: [function(data, config) {
    return qs.stringify(data, { allowDots: true })
  }]
})

// 全屏加载遮罩，需要自己维持单例
let loading = null
service.interceptors.request.use((config) => {
  // 如果当前运行环境是服务端就使用代理之后的路径，如果不是服务端就直接使用基础路径
  const baseUrl = process.server ? process.env.VUE_MOCK_PROXY : process.env.VUE_APP_BASE_API
  // 替换掉协议后面可能多余的 //
  config.url = (baseUrl + '/' + config.url).replace(/(?<!:)\/\//, '/')

  const source = axios.CancelToken.source()
  config.cancelToken = source.token

  config = {
    // 默认不使用全局加载
    loading: false,
    ...config
  }

  if (!process.server) {
    // 配置中有loading，并且loading没有初始化
    if (config.loading && !loading) {
      loading = Loading.service({
        text: '数据请求中，请稍后',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
        lock: true
      })
    }
  }

  return config
})
// response interceptor
service.interceptors.response.use(
  (response) => {
    if (!process.server) {
      // 关闭loading
      if (loading) {
        loading.close()
        loading = null
      }
    }
    const res = response.data
    const config = {
      // 默认不隐藏
      // 隐藏消息，只能隐藏成功的消息，错误的消息不能隐藏
      hideMsg: false,
      ...response.config
    }

    if (res.success) {
      // 处理返回消息
      if (!process.server) {
        if (!config.hideMsg && res.message) {
          const method = res.success ? 'success' : 'error'
          Message[method](res.message)
        }
      }
      return res
    } else {
      if (!process.server && res.message) {
        // 不隐藏错误信息
        Message.error(res.message)
      }

      return Promise.reject(res)
    }
  },
  (error) => {
    if (!process.server) {
      // 关闭loading
      if (loading) {
        loading.close()
        loading = null
      }
    }

    let msg = ''
    // 不处理重置路由阶段的错误提示
    if (error.message.includes('resetting')) return
    else if (error.message.includes('timeout')) msg = '请求 ' + error.config.url + ' 超时，请稍后重试'
    else if (error.message.includes('404')) msg = '请求路径 ' + error.config.url + ' 不存在，请检查'
    else if (error.message.includes('413')) msg = '上传的文件过大，请检查'
    console.log('err' + error) // for debug
    if (!process.server) {
      Message({
        message: msg || error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service

/**
 * 基础的分页查询功能
 * @param url {String} 请求的url地址
 * @param searchObj {Object} 排序对象
 * @param orderObj {{prop: String, order: 'ascending'|'desc'}} element-ui 的一个排序对象
 * @param pageIndex {Number} 分页页码 从0开始
 * @param pageSize {Number} 一页大小默认5
 * @param hideMsg {Boolean} 默认隐藏接口提示消息
 * @return {AxiosPromise<any>}
 */
export function baseQueryByPage(url, searchObj = {}, orderObj = {}, pageIndex = 0, pageSize = 5, hideMsg = true) {
  const orderStr = typeof orderObj.prop !== 'undefined'
    ? `${orderObj.prop}|${orderObj.order === 'ascending' ? 'asc' : 'desc'}` : ''
  return service.post(url, {
    ...searchObj,
    pageIndex,
    pageSize,
    sort: orderStr
  }, {
    hideMsg
  })
}
