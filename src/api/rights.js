import request from '@/utils/request'

export function getRights() {
  return request({
    url: '/getAllRights',
    method: 'get',
  })
}

export function getAllRoles() {
  return request({
    url: '/getAllRoles',
    method: 'get'
  })
}
