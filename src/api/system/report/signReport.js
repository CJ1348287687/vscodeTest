import request from '@/utils/request'

// 查询签到列表 报表数据
export function listSign(query) {
  return request({
    url: '/system/signReport/signList',
    method: 'get',
    params: query
  })
}

// 根据签到id查询 签到分享记录列表
export function listSignShare(query) {
  return request({
    url: '/system/signReport/signShareList',
    method: 'get',
    params: query
  })
}

// 根据签到分享记录id查询 签到分享收集结果列表
export function listSignRecord(query) {
  return request({
    url: '/system/signReport/signRecordList',
    method: 'get',
    params: query
  })
}

