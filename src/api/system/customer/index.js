import request from '@/utils/request'

// 列表
export function intentionCustomerList(query) {
  return request({
    url: '/system/customer/intentionCustomerList',
    method: 'get',
    params: query
  })
}

export function customerList(query) {
  return request({
    url: '/system/customer/customerList',
    method: 'get',
    params: query
  })
}

export function customerElementList(query) {
  return request({
    url: '/system/customer/customerElementList',
    method: 'get',
    params: query
  })
}

// 派发
export function forwardUser(data) {
  return request({
    url: '/system/customer/forwardUser',
    method: 'post',
    data: data
  })
}

// 联系用户
export function updateStatus(data) {
  return request({
    url: '/system/customer/updateStatus',
    method: 'post',
    data: data
  })
}

// 日志列表
export function customerLogList(query) {
  return request({
    url: '/system/customer/logList',
    method: 'get',
    params: query
  })
}

// 产品列表
export function productList(query) {
  return request({
    url: '/system/customer/productList',
    method: 'get',
    params: query
  })
}