import request from '@/utils/request'

// 推文列表
export function tweetListList(query) {
  return request({
    url: '/system/display/rack/tweetList',
    method: 'get',
    params: query
  })
}

// 列表
export function displayRackList(query) {
  return request({
    url: '/system/display/rack/list',
    method: 'get',
    params: query
  })
}

// 新增
export function displayRackAdd(data) {
  return request({
    url: '/system/display/rack/add',
    method: 'post',
    data: data
  })
}

// 详情
export function displayRackInfo(data) {
  return request({
    url: '/system/display/rack/getInfo',
    method: 'post',
    data: data
  })
}

// 修改
export function displayRackEdit(data) {
  return request({
    url: '/system/display/rack/edit',
    method: 'post',
    data: data
  })
}

// 删除
export function displayRackRemove(data) {
  return request({
    url: '/system/display/rack/remove',
    method: 'post',
    data: data
  })
}

// 批量删除
export function displayRackRemoves(data) {
  return request({
    url: '/system/display/rack/removes',
    method: 'post',
    data: data
  })
}
