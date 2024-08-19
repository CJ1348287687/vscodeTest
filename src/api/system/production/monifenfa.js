import request from '@/utils/request'

export function tweetSort(data) {
  return request({
    url: '/system/production/tweet/showElems',
    method: 'post',
    data: data
  })
}


export function execute(data) {
  return request({
    url: '/system/production/tweet/execute',
    method: 'post',
    data: data
  })
}
