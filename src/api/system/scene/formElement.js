import request from '@/utils/request'

// 查询表单属性列表
export function listElement(query) {
  return request({
    url: '/system/formElement/list',
    method: 'get',
    params: query
  })
}

// 查询表单属性列表数据
export function listElementData(query) {
  return request({
    url: '/system/formElement/listData',
    method: 'get',
    params: query
  })
}

// 查询表单属性详细
export function getElement(id) {
  return request({
    url: '/system/formElement/' + id,
    method: 'get'
  })
}

// 新增表单属性
export function addElement(data) {
  return request({
    url: '/system/formElement',
    method: 'post',
    data: data
  })
}

// 修改表单属性
export function updateElement(data) {
  return request({
    url: '/system/formElement',
    method: 'put',
    data: data
  })
}

// 删除表单属性
export function delElement(id) {
  return request({
    url: '/system/formElement/' + id,
    method: 'delete'
  })
}

// 查询表单属性选项列表
export function listElementOption(query) {
  return request({
    url: '/system/formElementOption/list',
    method: 'get',
    params: query
  })
}

// 查询表单属性选项详细
export function getElementOption(id) {
  return request({
    url: '/system/formElementOption/' + id,
    method: 'get'
  })
}

// 新增表单属性选项
export function addElementOption(data) {
  return request({
    url: '/system/formElementOption',
    method: 'post',
    data: data
  })
}

// 修改表单属性选项
export function updateElementOption(data) {
  return request({
    url: '/system/formElementOption',
    method: 'put',
    data: data
  })
}

// 删除表单属性选项
export function delElementOption(id) {
  return request({
    url: '/system/formElementOption/' + id,
    method: 'delete'
  })
}

// 日志列表
export function formElementLogList(query) {
  return request({
    url: '/system/formElement/logList',
    method: 'get',
    params: query
  })
}
