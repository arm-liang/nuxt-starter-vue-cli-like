import request from '@/util/request'

// 测试接口
export function test() {
  return request.get('/users/matz', { loading: true })
}
