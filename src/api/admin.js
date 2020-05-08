import request from '@/utils/request'

/**
 * 管理员登陆
 * @param data 管理员账号密码
 * @returns {AxiosPromise}
 */
export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

/**
 * 获取管理员列表 （query: 查询条件  pageNo： 当前页码号  pageSize: 每页大小， 均可为空且都由后台提供默认值）
 * @returns {AxiosPromise}
 */
export function getAllAdminByNameOrPhone(data) {
  return request({
    url: '/getAllAdminByNameOrPhone',
    method: 'post',
    data
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

/**
 * 添加管理员
 * @param data  管理员信息（姓名（name）、手机号（phone）、登陆密码（password）、描述（introduction，可为空）， 角色id（rid））
 * @returns {AxiosPromise}
 */
export function addAdmin(data) {
  return request({
    url: '/addAdmin',
    method: "post",
    data
  })
}

/**
 * 添加管理员
 * @param data  管理员信息（管理员id（aid）姓名（name）、手机号（phone）、登陆密码（password）、描述（introduction，可为空）， 角色id（rid） 均可为空但是管理员id必须不为空）
 * @returns {AxiosPromise}
 */
export function updateAdmin(data) {
  return request({
    url: '/updateAdmin',
    method: "post",
    data
  })
}
