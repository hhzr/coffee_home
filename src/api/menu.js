import request from '@/utils/request'

/**
 * 获取菜单列表
 * @returns {AxiosPromise}
 */
export function getMenu() {
  return request({
    url: '/getMenu',
    method: 'get',
  })
}
