import request from '@/utils/request'

// 查询图片
export function getImgList(query) {
  return request({
    url: '/system/production/tweet/mediaImageList',
    method: 'get',
    params: query
  })
}

// 查询视频
export function getVideoList(query) {
  return request({
    url: '/system/production/tweet/mediaVideoList',
    method: 'get',
    params: query
  })
}
// 查询优惠卷
export function getProcutCouponList(query) {
  return request({
    url: '/system/production/tweet/procutCouponList',
    method: 'get',
    params: query
  })
}
// 查询文案
export function getmediaTextList(query) {
  return request({
    url: '/system/production/tweet/mediaTextList',
    method: 'get',
    params: query
  })
}
// 查询表单
export function getsceneFormList(query) {
  return request({
    url: '/system/production/tweet/sceneFormList',
    method: 'get',
    params: query
  })
}

// 查询签到-表单
export function getsceneSignList(query) {
  return request({
    url: '/system/production/tweet/sceneSignList',
    method: 'get',
    params: query
  })
}

// 查询活码
export function getsceneLiveCodeList(query) {
  return request({
    url: '/system/production/tweet/sceneLiveCodeList',
    method: 'get',
    params: query
  })
}

// 新增推文
export function addtweet(data) {
  return request({
    url: '/system/production/tweet/add',
    method: 'post',
    data: data
  })
}

// 推文详情
export function getInfotweet(data) {
  return request({
    url: '/system/production/tweet/getInfo',
    method: 'post',
    data: data
  })
}

// 修改推文
export function edittweet(data) {
  return request({
    url: '/system/production/tweet/edit',
    method: 'post',
    data: data
  })
}




// 已选择组织列表
export function allocatedOrganizationList(query) {
  return request({
    url: '/system/production/tweet/allocatedOrganizationList',
    method: 'get',
    params: query
  })
}

// 已排除组织列表
export function unallocatedOrganizationList(query) {
  return request({
    url: '/system/production/tweet/unallocatedOrganizationList',
    method: 'get',
    params: query
  })
}

//组织关系删除
export function organizationAllocatedDelete(data) {
  return request({
    url: '/system/production/tweet/organizationAllocatedDelete',
    method: 'post',
    data: data
  })
}
// 关系新增
export function addAllocated(data) {
  return request({
    url: '/system/production/tweet/addAllocated',
    method: 'post',
    data: data
  })
}
// 手机预览构建
export function previewBuild(data) {
  return request({
    url: '/system/production/tweet/previewBuild',
    method: 'post',
    data: data
  })
}

// 获取推文链接
export function getConfigKey(query) {
  return request({
    url: '/system/config/configKey/tweet_preview_url',
    method: 'get',
    params: query
  })
}

// 表单默认图片
export function getFormSuccessPic(query) {
  return request({
    url: '/system/config/configKey/form_result_img_url',
    method: 'get',
    params: query
  })
}

// 表单默认图片
export function getFormSuccessPic_hk(query) {
  return request({
    url: '/system/config/configKey/form_result_img_url_hk',
    method: 'get',
    params: query
  })
}


// 查询产品模板列表数据
export function getProductMbList(query) {
  return request({
    url: '/system/mb/getProductMbList',
    method: 'get',
    params: query
  })
}

// 图片上传
export function uploadPic(data) {
  return request({
    url: '/common/upload',
    method: 'post',
    data: data
  })
}

//事假列表
export function sceneSysEventList(query) {
  return request({
    url: '/system/production/tweet/sceneSysEventList',
    method: 'get',
    params: query
  })
}