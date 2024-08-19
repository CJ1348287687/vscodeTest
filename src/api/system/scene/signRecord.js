import request from '@/utils/request'

// 查询签到分享记录列表
export function getByShareIdPhone(data) {
  return request({
    url: '/system/signRecord/getByShareIdPhone',
    method: 'post',
    data: data
  })
}

// 新增签到
export function addSignRecord(data) {
  return request({
    url: '/system/signRecord',
    method: 'post',
    data: data
  })
}

// 核销签到码
export function updateCheckout(data) {
  return request({
    url: '/system/signRecord/updateCheckout',
    method: 'post',
    data: data
  })
}
