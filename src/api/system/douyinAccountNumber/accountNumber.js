import request from '@/utils/request'

// 查询短信模板列表
export function listAccountNumber(query) {
  return request({
    url: '/system/accountNumber/list',
    method: 'get',
    params: query
  })
}
// 查询短信模板详细
export function getAccountNumber(id) {
  return request({
    url: '/system/accountNumber/' + id,
    method: 'get'
  })
}

// 新增短信模板
export function addAccountNumber(data) {
  return request({
    url: '/system/accountNumber',
    method: 'post',
    data: data
  })
}

// 修改短信模板
export function updateAccountNumber(data) {
  return request({
    url: '/system/accountNumber',
    method: 'put',
    data: data
  })
}

// 删除短信模板
export function delAccountNumber(id) {
  return request({
    url: '/system/accountNumber/' + id,
    method: 'delete'
  })
}

// 新增组织
export function addOrganization(data) {
  return request({
    url: '/system/accountNumber/addOrganization',
    method: 'post',
    data: data
  })
}

// 删除组织
export function deleteOrganization(id) {
  return request({
    url: '/system/accountNumber/deleteOrganization/' + id,
    method: 'delete'
  })
}

// 查询产品模版下组织列表
export function getOrganizationList(query) {
  return request({
    url: '/system/accountNumber/getOrganizationList',
    method: 'get',
    params: query
  })
}
