import request from '@/utils/request'

// 列表
export function tweetReport(query) {
  return request({
    url: '/system/share/tweetReport',
    method: 'get',
    params: query
  })
}

export function channelReport(query) {
  return request({
    url: '/system/share/channelReport',
    method: 'get',
    params: query
  })
}

export function shareReport(query) {
  return request({
    url: '/system/share/shareReport',
    method: 'get',
    params: query
  })
}

export function sharePhoneReport(query) {
  return request({
    url: '/system/share/sharePhoneReport',
    method: 'get',
    params: query
  })
}

export function targetReport(query) {
  return request({
    url: '/system/share/targetReport',
    method: 'get',
    params: query
  })
}

export function customerList(query) {
  return request({
    url: '/system/share/customerList',
    method: 'get',
    params: query
  })
}

// 列表
export function sharePersonReport(query) {
  return request({
    url: '/system/share/sharePersonReport',
    method: 'get',
    params: query
  })
}


// 手机端首页看板
export function selectCustomerReportRealTime(query) {
  return request({
    url: '/system/share/selectCustomerReportRealTime',
    method: 'get',
    params: query
  })
}
// 手机端首页看板--实时数据
export function selectCustomerReport(query) {
  return request({
    url: '/system/share/selectCustomerReport',
    method: 'get',
    params: query
  })
}
// 手机端订单列表--跟踪状态列表
export function selectCustomerReportTrackStatus(query) {
  return request({
    url: '/system/share/selectCustomerReportTrackStatus',
    method: 'get',
    params: query
  })
}

// 手机端订单列表--产品模板类型列表
export function selectCustomerReportTemplateType(query) {
  return request({
    url: '/system/share/selectCustomerReportTemplateType',
    method: 'get',
    params: query
  })
}

