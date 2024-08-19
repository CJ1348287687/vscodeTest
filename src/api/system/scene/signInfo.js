import request from '@/utils/request'

// 查询签到列表
export function listInfo(query) {
  return request({
    url: '/system/signInfo/list',
    method: 'get',
    params: query
  })
}

// 查询签到详细
export function getInfo(id) {
  return request({
    url: '/system/signInfo/' + id,
    method: 'get'
  })
}

// 查询签到详细数据
export function getInfoData(id) {
  return request({
    url: '/system/signInfo/getInfoData/' + id,
    method: 'get'
  })
}

// 查询签到列表数据
export function listInfoData(query) {
  return request({
    url: '/system/signInfo/listData',
    method: 'get',
    params: query
  })
}

// 查询签到列表数据详情
export function listInfoDataDetail(query) {
  return request({
    url: '/system/signInfo/listDataDetail',
    method: 'get',
    params: query
  })
}

// 新增签到
export function addInfo(data) {
  return request({
    url: '/system/signInfo/add',
    method: 'post',
    data: data
  })
}

// 修改签到
export function updateInfo(data) {
  return request({
    url: '/system/signInfo/edit',
    method: 'post',
    data: data
  })
}

// 修改签到状态
export function updateStatus(data) {
  return request({
    url: '/system/signInfo/updateStatus',
    method: 'post',
    data: data
  })
}

// 删除签到
export function delInfo(id) {
  return request({
    url: '/system/signInfo/' + id,
    method: 'delete'
  })
}

// 日志列表
export function signLogList(query) {
  return request({
    url: '/system/signInfo/logList',
    method: 'get',
    params: query
  })
}

//上传
export function signUpload(data) {
  return request({
    url: '/system/signInfo/upload',
    method: 'post',
    data: data
  })
}

// 查询签到分享记录详情
export function getSignRecord(id) {
  return request({
    url: '/system/signRecord/' + id,
    method: 'get'
  })
}


