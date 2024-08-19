import request from '@/utils/request'

// 查询抖音店铺列表
export function listShop(query) {
  return request({
    url: '/system/shop/list',
    method: 'get',
    params: query
  })
}

export function listAll(query) {
  return request({
    url: '/system/shop/listAll',
    method: 'get',
    params: query
  })
}

// 查询抖音店铺详细
export function getShop(id) {
  return request({
    url: '/system/shop/' + id,
    method: 'get'
  })
}

// 新增抖音店铺
export function addShop(data) {
  return request({
    url: '/system/shop',
    method: 'post',
    data: data
  })
}

// 新增组织
export function addOrganization(data) {
  return request({
    url: '/system/shop/addOrganization',
    method: 'post',
    data: data
  })
}

// 修改抖音店铺
export function updateShop(data) {
  return request({
    url: '/system/shop',
    method: 'put',
    data: data
  })
}

// 删除抖音店铺
export function delShop(id) {
  return request({
    url: '/system/shop/' + id,
    method: 'delete'
  })
}
