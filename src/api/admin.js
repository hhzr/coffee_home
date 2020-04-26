import request from '@/utils/request'

/**
 * 管理员登陆
 * @param data 管理员账号密码
 * @returns {AxiosPromise}
 */
export function login(data) {
  return request({
    url: '/checkLogin',
    method: 'post',
    data
  })
}

/**
 * 获取管理员列表
 * @returns {AxiosPromise}
 */
export function getAllAdmin() {
  return request({
    url: '/getAllAdmin',
    method: 'post',
  })
}

/**
 * 修改管理员状态
 * @param data  管理员id： aid    修改后的状态： status
 * @returns {AxiosPromise}
 */
export function setAdminStatus(data) {
  return request({
    url: '/updateAdminStatus',
    method: 'post',
    data
  })
}

/**
 * 删除管理员
 * @param aid   管理员id
 * @returns {AxiosPromise}
 */
export function delAdmin(aid) {
  return request({
    url: '/delAdmin',
    method: 'get',
    params: {
      aid
    }
  })
}
