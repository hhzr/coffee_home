import request from '@/utils/request'

export function getMenu(rid) {
  return request({
    url: '/getMenu',
    method: 'get',
    params: {
      roleId: rid
    }
  })
}
