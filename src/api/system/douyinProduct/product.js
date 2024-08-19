import request from '@/utils/request'

// 查询抖音商品列表
export function listProduct(query) {
  return request({
    url: '/system/product/list',
    method: 'get',
    params: query
  })
}

// 查询抖音商品详细
export function getProduct(id) {
  return request({
    url: '/system/product/' + id,
    method: 'get'
  })
}

// 新增抖音商品
export function addProduct(data) {
  return request({
    url: '/system/product',
    method: 'post',
    data: data
  })
}

// 修改抖音商品
export function updateProduct(data) {
  return request({
    url: '/system/product',
    method: 'put',
    data: data
  })
}

// 删除抖音商品
export function delProduct(id) {
  return request({
    url: '/system/product/' + id,
    method: 'delete'
  })
}

// 删除关联配置
export function deletePush(id) {
  return request({
    url: '/system/product/deletePush/' + id,
    method: 'delete'
  })
}



// 同步
export function synchronousctProd(data) {
  return request({
    url: '/system/product/synchronousctProd',
    method: 'post',
    data: data
  })
}

// 新增组织
export function addOrganization(data) {
  return request({
    url: '/system/product/addOrganization',
    method: 'post',
    data: data
  })
}

// 批量新增组织
export function addOrganizationBatch(data) {
  return request({
    url: '/system/product/addOrganizationBatch',
    method: 'post',
    data: data
  })
}

// 获取商品策略
export function tacticList(query) {
  return request({
    url: '/system/product/tacticList',
    method: 'get',
    params: query
  })
}

// 新增/修改商品策略
export function addTactic(data) {
  return request({
    url: '/system/product/addTactic',
    method: 'post',
    data: data
  })
}

// 批量新增/批量修改商品策略
export function addTacticBatch(data) {
  return request({
    url: '/system/product/addTacticBatch',
    method: 'post',
    data: data
  })
}

export function getGranrList(query) {
  return request({
    url: '/system/product/getGranrList',
    method: 'get',
    params: query
  })
}

export function addGranrList(data) {
  return request({
    url: '/system/product/addGranrList',
    method: 'post',
    data: data
  })
}


// 新增短信模板
export function addSmsTemplate(data) {
  return request({
    url: '/system/product/addSmsTemplate',
    method: 'post',
    data: data
  })
}

// 批量短信模板
export function addSmsTemplateBatch(data) {
  return request({
    url: '/system/product/addSmsTemplateBatch',
    method: 'post',
    data: data
  })
}

// 查询商品下可查看组织列表
export function getViewOrganizationList(query) {
  return request({
    url: '/system/product/getViewOrganizationList',
    method: 'get',
    params: query
  })
}

// 新增可查看组织
export function addViewOrganization(data) {
  return request({
    url: '/system/product/addViewOrganization',
    method: 'post',
    data: data
  })
}

// 删除可查看组织
export function deleteViewOrganization(id) {
  return request({
    url: '/system/product/deleteViewOrganization/' + id,
    method: 'delete'
  })
}

