import request from '@/utils/request'

// 查询产品模版类型列表
export function listType(query) {
  return request({
    url: '/system/type/list',
    method: 'get',
    params: query
  })
}

// 查询产品模版类型详细
export function getType(id) {
  return request({
    url: '/system/type/' + id,
    method: 'get'
  })
}
// 新增产品模版类型
export function addType(data) {
  return request({
    url: '/system/type',
    method: 'post',
    data: data
  })
}
// 修改产品模版类型
export function updateType(data) {
  return request({
    url: '/system/type',
    method: 'put',
    data: data
  })
}
// 删除产品模版类型
export function delType(id) {
  return request({
    url: '/system/type/' + id,
    method: 'delete'
  })
}
// 状态修改
export function updateTypeStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/system/type',
    method: 'put',
    data: data
  })
}

// 新增组织
export function addOrganization(data) {
  return request({
    url: '/system/type/addOrganization',
    method: 'post',
    data: data
  })
}
// 删除组织
export function deleteOrganization(id) {
  return request({
    url: '/system/type/deleteOrganization/' + id,
    method: 'delete'
  })
}
// 查询产品模版类型下组织列表
export function getOrganizationList(query) {
  return request({
    url: '/system/type/getOrganizationList',
    method: 'get',
    params: query
  })
}
