import request from '@/utils/request'

// 查询活码列表
export function listCode(query) {
  return request({
    url: '/system/liveCode/list',
    method: 'get',
    params: query
  })
}

// 查询活码详细
export function getCode(id) {
  return request({
    url: '/system/liveCode/' + id,
    method: 'get'
  })
}

// 新增活码
export function addCode(data) {
  return request({
    url: '/system/liveCode',
    method: 'post',
    data: data
  })
}

// 修改活码
export function updateCode(data) {
  return request({
    url: '/system/liveCode',
    method: 'put',
    data: data
  })
}

// 修改状态
export function updateStatus(data) {
  return request({
    url: '/system/liveCode/updateStatus',
    method: 'post',
    data: data
  })
}

// 删除活码
export function delCode(id) {
  return request({
    url: '/system/liveCode/' + id,
    method: 'delete'
  })
}

// 日志列表
export function liveCodeLogList(query) {
  return request({
    url: '/system/liveCode/logList',
    method: 'get',
    params: query
  })
}
