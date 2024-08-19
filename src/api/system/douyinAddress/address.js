import request from '@/utils/request'

// 查询抖店地址库列表
export function listAddress(query) {
  return request({
    url: '/system/douyinAddress/list',
    method: 'get',
    params: query
  })
}

// 查询抖店地址库详细
export function getAddress(id) {
  return request({
    url: '/system/douyinAddress/' + id,
    method: 'get'
  })
}

// 新增抖店地址库
export function addAddress(data) {
  return request({
    url: '/system/douyinAddress',
    method: 'post',
    data: data
  })
}

// 修改抖店地址库
export function updateAddress(data) {
  return request({
    url: '/system/douyinAddress',
    method: 'put',
    data: data
  })
}

// 删除抖店地址库
export function delAddress(id) {
  return request({
    url: '/system/douyinAddress/' + id,
    method: 'delete'
  })
}

// 同步
export function synchronousAddress(data) {
  return request({
    url: '/system/douyinAddress/synchronousAddress',
    method: 'post',
    data: data
  })
}
