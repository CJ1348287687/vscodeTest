import request from '@/utils/request'

// 列表
export function tweetList(query) {
  return request({
    url: '/system/display/channel/tweetList',
    method: 'get',
    params: query
  })
}

// 列表
export function tweetChannelList(query) {
  return request({
    url: '/system/display/channel/list',
    method: 'get',
    params: query
  })
}

// 详情
export function tweetChannelInfo(data) {
  return request({
    url: '/system/display/channel/getInfo',
    method: 'post',
    data: data
  })
}

// 新增
export function tweetChannelAdd(data) {
  return request({
    url: '/system/display/channel',
    method: 'post',
    data: data
  })
}

// 新增批量
export function tweetChannelAddBatch(data) {
  return request({
    url: '/system/display/channel/addBatch',
    method: 'post',
    data: data
  })
}

// 修改
export function tweetChannelUpdate(data) {
  return request({
    url: '/system/display/channel',
    method: 'put',
    data: data
  })
}

// 修改
export function tweetChannelUpdateStatus(data) {
  return request({
    url: '/system/display/channel/updateStatus',
    method: 'post',
    data: data
  })
}

// 删除
export function tweetChannelRemove(data) {
  return request({
    url: '/system/display/channel/remove',
    method: 'post',
    data: data
  })
}

// 批量删除
export function tweetChannelRemoves(data) {
  return request({
    url: '/system/display/channel/removes',
    method: 'post',
    data: data
  })
}

// 根据推文id和渠道id查询 表单策略/活码策略
export function tacticList(query) {
  return request({
    url: '/system/display/channel/tacticList',
    method: 'get',
    params: query
  })
}