import request from '@/utils/request'

// 查询层级列表
export function messageList(query) {
  return request({
    url: '/system/message/list',
    method: 'get',
    params: query
  })
}

// 未读变已读
export function messageChangeIsRead(data) {
  return request({
    url: '/system/message/changeIsRead',
    method: 'post',
    data: data
  })
}

// 未读列表
export function messageUnReadList(query) {
  return request({
    url: '/system/message/unReadList',
    method: 'get',
    params: query
  })
}
