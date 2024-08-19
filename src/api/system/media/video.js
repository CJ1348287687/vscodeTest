import request from '@/utils/request'

//上传
export function videoUpload(data) {
  return request({
    url: '/system/media/video/upload',
    method: 'post',
    data: data
  })
}

// 列表
export function videoList(query) {
  return request({
    url: '/system/media/video/list',
    method: 'get',
    params: query
  })
}

// 日志列表
export function videoLogList(query) {
  return request({
    url: '/system/media/video/logList',
    method: 'get',
    params: query
  })
}

// 新增
export function videoAdd(data) {
  return request({
    url: '/system/media/video/add',
    method: 'post',
    data: data
  })
}

// 详情
export function videoInfo(data) {
  return request({
    url: '/system/media/video/getInfo',
    method: 'post',
    data: data
  })
}

// 修改
export function videoEdit(data) {
  return request({
    url: '/system/media/video/edit',
    method: 'post',
    data: data
  })
}
// 启用状态切换
export function videoUsingChange(data) {
  return request({
    url: '/system/media/video/videoUsingChange',
    method: 'post',
    data: data
  })
}
// 删除
export function videoRemove(data) {
  return request({
    url: '/system/media/video/remove',
    method: 'post',
    data: data
  })
}

// 批量删除
export function videoRemoves(data) {
  return request({
    url: '/system/media/video/removes',
    method: 'post',
    data: data
  })
}
