import request from '@/utils/request'

// 查询签到分享记录列表
export function listSignShare(query) {
  return request({
    url: '/system/signShare/list',
    method: 'get',
    params: query
  })
}

// 签到二维码生成
export function addSignShare(data) {
  return request({
    url: '/system/signShare',
    method: 'post',
    data: data
  })
}
