import request from '@/utils/request'

// 列表
export function tweetShareList(query) {
  return request({
    url: '/system/display/share/list',
    method: 'get',
    params: query
  })
}

// 新增
export function tweetShareAdd(data) {
  return request({
    url: '/system/display/share',
    method: 'post',
    data: data
  })
}

// 根据参数键名查询参数值
export function getConfigKey(configKey) {
  return request({
    url: '/system/config/configKey/' + configKey,
    method: 'get'
  })
}