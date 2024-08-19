import request from '@/utils/request'

// 查询
export function listTweetBase(query) {
  return request({
    url: '/system/report/tweetBase/list',
    method: 'get',
    params: query
  })
}

//  推文下表单列表
export function listFormData(query) {
  return request({
    url: '/system/report/tweetBase/formList',
    method: 'get',
    params: query
  })
}

//  推文下签到列表
export function listSignData(query) {
  return request({
    url: '/system/report/tweetBase/signList',
    method: 'get',
    params: query
  })
}

//  推文下表单记录列表
export function listFormRecordData(query) {
  return request({
    url: '/system/report/tweetBase/formRecordList',
    method: 'get',
    params: query
  })
}

//  推文下签到记录列表
export function listSignRecordData(query) {
  return request({
    url: '/system/report/tweetBase/signRecordList',
    method: 'get',
    params: query
  })
}
