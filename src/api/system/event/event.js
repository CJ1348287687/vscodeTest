import request from '@/utils/request'


// 新增事件
export function addEvent(data) {
  return request({
    url: '/system/event',
    method: 'post',
    data: data
  })
}
// 查询事件列表
export function listEvent(query) {
  return request({
    url: '/system/event/list',
    method: 'get',
    params: query
  })
}

// 查询事件详细
export function getEvent(id) {
  return request({
    url: '/system/event/' + id,
    method: 'get'
  })
}


// 修改活码
export function updateEvent(data) {
  return request({
    url: '/system/event',
    method: 'put',
    data: data
  })
}

// 修改状态
export function updateStatus(data) {
  return request({
    url: '/system/event/updateStatus',
    method: 'post',
    data: data
  })
}

// 删除事件
export function delEvent(id) {
  return request({
    url: '/system/event/' + id,
    method: 'delete'
  })
}

// 日志列表
export function eventLogList(query) {
  return request({
    url: '/system/event/logList',
    method: 'get',
    params: query
  })
}


