import request from '@/utils/request'

// 查询展架分发数据列表
export function tweetRackDbList(query) {
  return request({
    url: '/system/display/rack/db/list',
    method: 'get',
    params: query
  })
}
