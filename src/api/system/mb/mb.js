import request from '@/utils/request'

// 查询产品模版列表
export function listMb(query) {
  return request({
    url: '/system/mb/list',
    method: 'get',
    params: query
  })
}

export function mbOptionListByOrganizationId(query) {
  return request({
    url: '/system/mb/mbOptionListByOrganizationId',
    method: 'get',
    params: query
  })
}

export function mbOptionListByManage(query) {
  return request({
    url: '/system/mb/mbOptionListByManage',
    method: 'get',
    params: query
  })
}

// 根据组织id查询产品模版
export function mbTypeListByOrganizationId(organizationId) {
  return request({
    url: '/system/type/listByOrganizationId/'+organizationId,
    method: 'get'
  })
}

export function mbTypeListByOrganizationId2(query) {
  return request({
    url: '/system/type/mbTypeListByOrganizationId',
    method: 'get',
    params: query
  })
}

export function mbTypeListByManage() {
  return request({
    url: '/system/type/mbTypeListByManage',
    method: 'get'
  })
}

// 状态修改
export function updateTypeStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/system/mb',
    method: 'put',
    data: data
  })
}

// 查询产品模版详细
export function getMb(id) {
  return request({
    url: '/system/mb/' + id,
    method: 'get'
  })
}
// 新增产品模版
export function addMb(data) {
  return request({
    url: '/system/mb',
    method: 'post',
    data: data
  })
}
// 修改产品模版
export function updateMb(data) {
  return request({
    url: '/system/mb',
    method: 'put',
    data: data
  })
}
// 删除产品模版
export function delMb(id) {
  return request({
    url: '/system/mb/' + id,
    method: 'delete'
  })
}

// 查询选项值列表
export function getOptionList(query) {
  return request({
    url: '/system/mb/getOptionList',
    method: 'get',
    params: query
  })
}
// 新增选项值列表
export function addOption(data) {
  return request({
    url: '/system/mb/addSysProductMbOption',
    method: 'post',
    data: data
  })
}
// 选项值详情
export function getOption(id) {
  return request({
    url: '/system/mb/selectSysProductMbOptionById/' + id,
    method: 'get'
  })
}
// 删除选项值
export function delOption(id) {
  return request({
    url: '/system/mb/deleteSysProductMbOption/' + id,
    method: 'delete'
  })
}
// 修改选项值
export function updateOption(data) {
  return request({
    url: '/system/mb/updateSysProductMbOption',
    method: 'put',
    data: data
  })
}

// 新增组织
export function addOrganization(data) {
  return request({
    url: '/system/mb/addOrganization',
    method: 'post',
    data: data
  })
}
// 删除组织
export function deleteOrganization(id) {
  return request({
    url: '/system/mb/deleteOrganization/' + id,
    method: 'delete'
  })
}
// 查询产品模版下组织列表
export function getOrganizationList(query) {
  return request({
    url: '/system/mb/getOrganizationList',
    method: 'get',
    params: query
  })
}

