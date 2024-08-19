import request from '@/utils/request'

// 查询短信模板列表
export function listTemplate(query) {
  return request({
    url: '/system/template/list',
    method: 'get',
    params: query
  })
}
// 查询短信模板详细
export function getTemplate(id) {
  return request({
    url: '/system/template/' + id,
    method: 'get'
  })
}

// 查询用户短信内容
export function getTemplateContent(query) {
  return request({
    url: '/system/template/content',
    method: 'get',
    params: query
  })
}
// 查询受理人短信内容
export function getTemplateAcceptedContent(query) {
  return request({
    url: '/system/template/acceptedContent',
    method: 'get',
    params: query
  })
}

// 新增短信模板
export function addTemplate(data) {
  return request({
    url: '/system/template',
    method: 'post',
    data: data
  })
}

// 修改短信模板
export function updateTemplate(data) {
  return request({
    url: '/system/template',
    method: 'put',
    data: data
  })
}

// 删除短信模板
export function delTemplate(id) {
  return request({
    url: '/system/template/' + id,
    method: 'delete'
  })
}

// 新增组织
export function addOrganization(data) {
  return request({
    url: '/system/template/addOrganization',
    method: 'post',
    data: data
  })
}

// 删除组织
export function deleteOrganization(id) {
  return request({
    url: '/system/template/deleteOrganization/' + id,
    method: 'delete'
  })
}

// 查询产品模版下组织列表
export function getOrganizationList(query) {
  return request({
    url: '/system/template/getOrganizationList',
    method: 'get',
    params: query
  })
}
