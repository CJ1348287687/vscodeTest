import request from '@/utils/request'

// 查询账号列表
export function listAccountNumber(query) {
  return request({
    url: '/system/accountNumber/accountNumberList',
    method: 'get',
    params: query
  })
}


export function getAccountNumberProductList(query) {
  return request({
    url: '/system/accountNumberProduct/getAccountNumberProductList',
    method: 'get',
    params: query
  })
}

export function getAccountNumberProduct(id) {
  return request({
    url: '/system/accountNumberProduct/getAccountNumberProduct/' + id,
    method: 'get',
  })
}

export function unallocatedProductList(query) {
  return request({
    url: '/system/accountNumberProduct/unallocatedProductList',
    method: 'get',
    params: query
  })
}

export function addAccountNumberProduct(data) {
  return request({
    url: '/system/accountNumberProduct/addAccountNumberProduct',
    method: 'post',
    data: data
  })
}

export function updateAccountNumberProduct(data) {
  return request({
    url: '/system/accountNumberProduct/updateAccountNumberProduct',
    method: 'post',
    data: data
  })
}

// 删除商品
export function deleteProduct(id) {
  return request({
    url: '/system/accountNumberProduct/deleteProduct/' + id,
    method: 'delete'
  })
}
