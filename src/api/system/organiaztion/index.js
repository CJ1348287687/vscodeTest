import request from '@/utils/request'

// 查找层级树
export function deptTreeSelect() {
  return request({
    url: '/system/organization/deptTree',
    method: 'get'
  })
}

// 列表
export function organizationList(query) {
  return request({
    url: '/system/organization/list',
    method: 'get',
    params: query
  })
}

// 新增
export function organizationAdd(data) {
  return request({
    url: '/system/organization/add',
    method: 'post',
    data: data
  })
}

// 详情
export function organizationInfo(data) {
  return request({
    url: '/system/organization/getInfo',
    method: 'post',
    data: data
  })
}

// 修改
export function organizationEdit(data) {
  return request({
    url: '/system/organization/edit',
    method: 'post',
    data: data
  })
}

// 删除
export function organizationRemove(data) {
  return request({
    url: '/system/organization/remove',
    method: 'post',
    data: data
  })
}

// 批量删除
export function organizationRemoves(data) {
  return request({
    url: '/system/organization/removes',
    method: 'post',
    data: data
  })
}

// 纳管组织列表
// 批量删除
export function nursingOrganizations(data) {
  return request({
    url: '/system/organization/nursingOrganizations',
    method: 'post',
    data: data
  })
}

// 甩单权限
export function shuffleOrders(data) {
  return request({
    url: '/system/organization/shuffleOrders',
    method: 'put',
    data: data
  })
}

// 根据deptID查询层级树结构
export function deptTreeDataSelect(deptId) {
  return request({
    url: '/system/organization/deptTree/'+deptId,
    method: 'get'
  })
}


