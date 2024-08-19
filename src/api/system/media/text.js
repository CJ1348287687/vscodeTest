import request from '@/utils/request'

// 列表
export function textList(query) {
  return request({
    url: '/system/media/text/list',
    method: 'get',
    params: query
  })
}

// 日志列表
export function textLogList(query) {
  return request({
    url: '/system/media/text/logList',
    method: 'get',
    params: query
  })
}

// 新增
export function textAdd(data) {
  return request({
    url: '/system/media/text/add',
    method: 'post',
    data: data
  })
}

// 详情
export function textInfo(data) {
  return request({
    url: '/system/media/text/getInfo',
    method: 'post',
    data: data
  })
}

// 修改
export function textEdit(data) {
  return request({
    url: '/system/media/text/edit',
    method: 'post',
    data: data
  })
}
// 启用状态切换
export function textUsingChange(data) {
  return request({
    url: '/system/media/text/textUsingChange',
    method: 'post',
    data: data
  })
}
// 删除
export function textRemove(data) {
  return request({
    url: '/system/media/text/remove',
    method: 'post',
    data: data
  })
}

// 批量删除
export function textRemoves(data) {
  return request({
    url: '/system/media/text/removes',
    method: 'post',
    data: data
  })
}
