import request from '@/utils/request'

// 查询抖音订单列表--主副结构
export function listOrder(query) {
  return request({
    url: '/system/order/list',
    method: 'get',
    params: query
  })
}

// 查询抖音订单列表--根据组织id查询--主副结构
export function listOrderData(data) {
  return request({
    url: '/system/order/orderList',
    method: 'post',
    data: data
  })
}

// 根据核销码查询核销列表
export function orderListByCoupon(query) {
  return request({
    url: '/system/order/orderListByCoupon',
    method: 'get',
    params: query
  })
}

// 查询抖音订单列表--根据组织id查询--主副结构
export function listOrderDetailsData(query) {
  return request({
    url: '/system/order/orderDetailsList',
    method: 'get',
    params: query
  })
}
// 查询抖音订单数据--订单+订单详情
export function listOrderDetailsAllData(query) {
  return request({
    url: '/system/order/orderDetailsDataList',
    method: 'get',
    params: query
  })
}

// 甩单
export function forwardUser(data) {
  return request({
    url: '/system/order/forwardUser',
    method: 'post',
    data: data
  })
}

// 同步受理组织
export function updateToOrgId(data) {
  return request({
    url: '/system/order/updateToOrgId',
    method: 'post',
    data: data
  })
}

// 主订单备注
export function updateRemarkOrder(data) {
  return request({
    url: '/system/order/updateRemarkOrder',
    method: 'post',
    data: data
  })
}

// 用户信息补录
export function updateUserInfo(data) {
  return request({
    url: '/system/order/updateUserInfo',
    method: 'post',
    data: data
  })
}

// 查询抖音订单详细
export function getOrder(id) {
  return request({
    url: '/system/order/' + id,
    method: 'get'
  })
}

// 新增抖音订单
export function addOrder(data) {
  return request({
    url: '/system/order',
    method: 'post',
    data: data
  })
}

// 修改抖音订单
export function updateOrder(data) {
  return request({
    url: '/system/order',
    method: 'put',
    data: data
  })
}

// 删除抖音订单
export function delOrder(id) {
  return request({
    url: '/system/order/' + id,
    method: 'delete'
  })
}

// 解密
export function datajm(data) {
  return request({
    url: '/system/order/getDataJm',
    method: 'post',
    data: data
  })
}

export function pushOrderBusiness(data) {
  return request({
    url: '/system/order/pushOrderBusiness',
    method: 'post',
    data: data
  })
}

// 查询该店铺是否存解密额度已用完情况
export function getDataJmNoNum(data) {
  return request({
    url: '/system/order/getDataJmNoNum',
    method: 'post',
    data: data
  })
}

// 同步
export function synchronousctOrder(data) {
  return request({
    url: '/system/order/synchronousctOrder',
    method: 'post',
    data: data
  })
}

// 审核
export function dataSh(data) {
  return request({
    url: '/system/order/dataSh',
    method: 'post',
    data: data
  })
}

// 发货
export function dataFh(data) {
  return request({
    url: '/system/order/dataFh',
    method: 'post',
    data: data
  })
}

// 核销
export function writeOff(data) {
  return request({
    url: '/system/order/writeOff',
    method: 'post',
    data: data
  })
}

export function selectExpressList() {
  return request({
    url: '/system/order/selectExpressList',
    method: 'get'
  })
}

// 全量/增量同步订单状态  isUpdate--是否更新受理组织 0未更新 1已更新 2正在更新
export function syncOrderAccept(data) {
  return request({
    url: '/system/order/syncOrderAccept',
    method: 'post',
    data: data
  })
}

// 批量---全量/增量同步订单状态  isUpdate--是否更新受理组织 0未更新 1已更新 2正在更新
export function syncOrderAcceptBatch(data) {
  return request({
    url: '/system/order/syncOrderAcceptBatch',
    method: 'post',
    data: data
  })
}


// 取消订单
export function cancelOrder(data) {
  return request({
    url: '/system/order/cancelOrder',
    method: 'post',
    data: data
  })
}

export function updateSellerWords(data) {
  return request({
    url: '/system/order/updateSellerWords',
    method: 'post',
    data: data
  })
}

export function goManualJm(ids) {
  return request({
    url: '/system/order/manualJm/'+ids,
    method: 'post'
  })
}

export function goSendSms(ids) {
  return request({
    url: '/system/order/sendSms/'+ids,
    method: 'post',
  })
}

// 操作记录列表
export function orderLogList(query) {
  return request({
    url: '/system/order/logList',
    method: 'get',
    params: query
  })
}

// 操作记录列表
export function pustOrderLogList(query) {
  return request({
    url: '/system/order/pustOrderLogList',
    method: 'get',
    params: query
  })
}


