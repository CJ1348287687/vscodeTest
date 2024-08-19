import request from '@/utils/request'

// 列表
export function tweetList(query) {
  return request({
    url: '/system/production/tweet/list',
    method: 'get',
    params: query
  })
}

// 新增
export function tweetAdd(data) {
  return request({
    url: '/system/production/tweet/add',
    method: 'post',
    data: data
  })
}

// 详情
export function tweetInfo(data) {
  return request({
    url: '/system/production/tweet/getInfo',
    method: 'post',
    data: data
  })
}

export function tweetUpdateInfo(data) {
  return request({
    url: '/system/production/tweet/getUpdateInfo',
    method: 'post',
    data: data
  })
}

export function tweetTactic(data) {
  return request({
    url: '/system/production/tweet/getTweetTactic',
    method: 'post',
    data: data
  })
}

// 修改
export function tweetEdit(data) {
  return request({
    url: '/system/production/tweet/edit',
    method: 'post',
    data: data
  })
}

export function tweetEditInfo(data) {
  return request({
    url: '/system/production/tweet/editInfo',
    method: 'post',
    data: data
  })
}

// 删除
export function tweetRemove(data) {
  return request({
    url: '/system/production/tweet/remove',
    method: 'post',
    data: data
  })
}

// 批量删除
export function tweetRemoves(data) {
  return request({
    url: '/system/production/tweet/removes',
    method: 'post',
    data: data
  })
}

//推文渠道出入库状态切换
export function changeChannelStatus(data) {
  return request({
    url: '/system/production/tweet/changeChannelStatus',
    method: 'post',
    data:data
  })
}
//当前用户下的组织
export function userOrganization(data) {
  return request({
    url: '/system/production/tweet/userOrganization',
    method: 'post',
    data:data
  })
}

//当前用户下的纳管组织
export function manageUserOrganization(data) {
  return request({
    url: '/system/production/tweet/manageUserOrganization',
    method: 'post',
    data:data
  })
}

//当前用户下的纳管组织
export function manageUserOrganizationSelect(data) {
  return request({
    url: '/system/production/tweet/manageUserOrganizationSelect',
    method: 'post',
    data:data
  })
}

//当前组织下的用户（组织下角色的）
export function organizationUser(data) {
  return request({
    url: '/system/production/tweet/organizationUser',
    method: 'post',
    data:data
  })
}


export function imgUpdeteByTweetId(data) {
  return request({
    url: '/system/production/tweet/imgUpdeteByTweetId',
    method: 'post',
    data:data
  })
}

