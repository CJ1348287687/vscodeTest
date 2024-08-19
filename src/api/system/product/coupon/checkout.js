import request from '@/utils/request'

// 列表
export function couponGainList(query) {
  return request({
    url: '/system/product/couponGain/list',
    method: 'get',
    params: query
  })
}

// 核销
export function couponGainCheckout(data) {
  return request({
    url: '/system/product/couponGain/checkout',
    method: 'post',
    data: data
  })
}

// 删除
export function couponGainRemove(data) {
  return request({
    url: '/system/product/couponGain/remove',
    method: 'post',
    data: data
  })
}

// 批量删除
export function couponGainRemoves(data) {
  return request({
    url: '/system/product/couponGain/removes',
    method: 'post',
    data: data
  })
}
