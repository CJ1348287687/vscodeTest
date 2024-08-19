import request from '@/utils/request'

// 列表
export function couponList(query) {
  return request({
    url: '/system/coupon/list',
    method: 'get',
    params: query
  })
}

// 日志列表
export function couponLogList(query) {
  return request({
    url: '/system/coupon/logList',
    method: 'get',
    params: query
  })
}

//上传
export function couponUpload(data) {
  return request({
    url: '/system/coupon/upload',
    method: 'post',
    data: data
  })
}

// 新增
export function couponAdd(data) {
  return request({
    url: '/system/coupon/add',
    method: 'post',
    data: data
  })
}

// 详情
export function couponInfo(data) {
  return request({
    url: '/system/coupon/getInfo',
    method: 'post',
    data: data
  })
}

// 修改
export function couponEdit(data) {
  return request({
    url: '/system/coupon/edit',
    method: 'post',
    data: data
  })
}

// 删除
export function couponRemove(data) {
  return request({
    url: '/system/coupon/remove',
    method: 'post',
    data: data
  })
}

// 批量删除
export function couponRemoves(data) {
  return request({
    url: '/system/coupon/removes',
    method: 'post',
    data: data
  })
}
