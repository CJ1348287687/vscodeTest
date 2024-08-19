import request from '@/utils/request'

// // 获取路由
// export const getRouters = () => {
//   return request({
//     url: '/getRouters',
//     method: 'get'
//   })
// }

// 获取路由
export const getRouters = (data) => {
  return request({
    url: '/getRouters',
    method: 'post',
    data:data
  })
}
