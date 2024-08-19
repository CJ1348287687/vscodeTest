import request from '@/utils/request'

// 列表
export function addressList(query) {
  return request({
    url: '/system/address/list',
    method: 'get',
    params: query
  })
}