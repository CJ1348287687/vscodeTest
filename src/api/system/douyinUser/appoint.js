import request from '@/utils/request'

export function appointList(data) {
  return request({
    url: '/system/douyin/user/appoint/appointList',
    method: 'post',
    data: data
  })
}

// 一线人员抢单
export function catchToUserId(data) {
  return request({
    url: '/system/douyin/user/appoint/catchToUserId',
    method: 'post',
    data: data
  })
}

// 甩单
export function forwardUser(data) {
  return request({
    url: '/system/douyin/user/appoint/forwardUser',
    method: 'post',
    data: data
  })
}

// 日志列表
export function logList(query) {
  return request({
    url: '/system/douyin/user/appoint/logList',
    method: 'get',
    params: query
  })
}

// 查询详细
export function getDetail(id) {
  return request({
    url: '/system/douyin/user/appoint/' + id,
    method: 'get'
  })
}