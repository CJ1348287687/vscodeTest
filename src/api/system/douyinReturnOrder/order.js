import request from '@/utils/request'

// 查询售后订单列表
export function listOrder(query) {
  return request({
    url: '/system/returnOrder/list',
    method: 'get',
    params: query
  })
}

// 查询售后订单详细
export function getOrder(id) {
  return request({
    url: '/system/returnOrder/' + id,
    method: 'get'
  })
}

// 新增售后订单
export function addOrder(data) {
  return request({
    url: '/system/returnOrder',
    method: 'post',
    data: data
  })
}

// 修改售后订单
export function updateOrder(data) {
  return request({
    url: '/system/returnOrder',
    method: 'put',
    data: data
  })
}

// 删除
export function delOrder(id) {
  return request({
    url: '/system/returnOrder/' + id,
    method: 'delete'
  })
}

export function updateSellerWords(data) {
  return request({
    url: '/system/returnOrder/updateSellerWords',
    method: 'post',
    data: data
  })
}

// 同步抖店订单
export function synchronousctOrder(data) {
  return request({
    url: '/system/returnOrder/synchronousctOrder',
    method: 'post',
    data: data
  })
}

// 售后
export function afterOrder(data) {
  return request({
    url: '/system/returnOrder/afterOrder',
    method: 'post',
    data: data
  })
}


// 查询抖音售后订单列表--根据组织id查询--主副结构
export function listOrderData(data) {
  return request({
    url: '/system/returnOrder/orderList',
    method: 'post',
    data: data
  })
}
// 查询抖音订单列表--根据组织id查询--主副结构
export function listOrderDetailsData(query) {
  return request({
    url: '/system/returnOrder/orderDetailsList',
    method: 'get',
    params: query
  })
}
// 查询抖音售后订单数据--订单+订单详情
export function listOrderDetailsAllData(query) {
  return request({
    url: '/system/returnOrder/orderDetailsDataList',
    method: 'get',
    params: query
  })
}

// 甩单
export function forwardUser(data) {
  return request({
    url: '/system/returnOrder/forwardUser',
    method: 'post',
    data: data
  })
}

// 同步受理组织
export function updateToOrgId(data) {
  return request({
    url: '/system/returnOrder/updateToOrgId',
    method: 'post',
    data: data
  })
}

// 主售后订单备注
export function updateRemarkOrder(data) {
  return request({
    url: '/system/returnOrder/updateRemarkOrder',
    method: 'post',
    data: data
  })
}

// 子售后订单备注
export function updateRemarkDetail(data) {
  return request({
    url: '/system/returnOrder/updateRemarkDetail',
    method: 'post',
    data: data
  })
}

export function getReturnAddress(data) {
  return request({
    url: '/system/returnOrder/selectAddressList',
    method: 'post',
    data: data
  })
}

export function selectJjShList(data) {
  return request({
    url: '/system/returnOrder/selectJjShList',
    method: 'post',
    data: data
  })
}

// 操作记录列表
export function returnOrderLogList(query) {
  return request({
    url: '/system/returnOrder/logList',
    method: 'get',
    params: query
  })
}
