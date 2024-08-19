import request from '@/utils/request'

// 推文列表
export function tweetList(data) {
  return request({
    url: '/app/tweet/tweetList',
    method: 'post',
    data: data
  })
}
// 推文详情
export function tweetDetail(data) {
  return request({
    url: '/app/tweet/tweetDetail',
    method: 'post',
    data: data
  })
}

// 推文分发
export function tweetShare(data) {
  return request({
    url: '/app/tweet/tweetShare',
    method: 'post',
    data: data
  })
}