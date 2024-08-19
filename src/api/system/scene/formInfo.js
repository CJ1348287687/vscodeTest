import request from '@/utils/request'

// 查询表单列表
export function listInfo(query) {
  return request({
    url: '/system/formInfo/list',
    method: 'get',
    params: query
  })
}

// 查询表单详细
export function getInfo(id) {
  return request({
    url: '/system/formInfo/' + id,
    method: 'get'
  })
}

// 查询表单详细数据
export function getInfoData(id) {
  return request({
    url: '/system/formInfo/getInfoData/' + id,
    method: 'get'
  })
}

// 查询表单列表数据
export function listInfoData(query) {
  return request({
    url: '/system/formInfo/listData',
    method: 'get',
    params: query
  })
}

// 查询表单列表数据详情
export function listInfoDataDetail(query) {
  return request({
    url: '/system/formInfo/listDataDetail',
    method: 'get',
    params: query
  })
}

// 新增表单
export function addInfo(data) {
  return request({
    url: '/system/formInfo/add',
    method: 'post',
    data: data
  })
}

// 修改表单
export function updateInfo(data) {
  return request({
    url: '/system/formInfo/edit',
    method: 'post',
    data: data
  })
}

// 修改表单状态
export function updateStatus(data) {
  return request({
    url: '/system/formInfo/updateStatus',
    method: 'post',
    data: data
  })
}

// 删除表单
export function delInfo(id) {
  return request({
    url: '/system/formInfo/' + id,
    method: 'delete'
  })
}

// 日志列表
export function formLogList(query) {
  return request({
    url: '/system/formInfo/logList',
    method: 'get',
    params: query
  })
}

// 查询用户表单详情
export function getFormRecord(id) {
  return request({
    url: '/system/formRecord/' + id,
    method: 'get'
  })
}
