import request from '@/utils/request'

//上传
export function imageUpload(data) {
  return request({
    url: '/system/media/image/upload',
    method: 'post',
    data: data
  })
}

// 列表
export function imageList(query) {
  return request({
    url: '/system/media/image/list',
    method: 'get',
    params: query
  })
}

// 日志列表
export function imageLogList(query) {
  return request({
    url: '/system/media/image/logList',
    method: 'get',
    params: query
  })
}

// 新增
export function imageAdd(data) {
  return request({
    url: '/system/media/image/add',
    method: 'post',
    data: data
  })
}

// 详情
export function imageInfo(data) {
  return request({
    url: '/system/media/image/getInfo',
    method: 'post',
    data: data
  })
}

// 修改
export function imageEdit(data) {
  return request({
    url: '/system/media/image/edit',
    method: 'post',
    data: data
  })
}
// 启用状态切换
export function imageUsingChange(data) {
  return request({
    url: '/system/media/image/imageUsingChange',
    method: 'post',
    data: data
  })
}
// 删除
export function imageRemove(data) {
  return request({
    url: '/system/media/image/remove',
    method: 'post',
    data: data
  })
}

// 批量删除
export function imageRemoves(data) {
  return request({
    url: '/system/media/image/removes',
    method: 'post',
    data: data
  })
}


