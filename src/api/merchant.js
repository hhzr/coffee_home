import request from '@/utils/request'

/**
 * 获取商户列表
 * @returns {AxiosPromise}
 */
export function getMerchant() {
  return request({
    url: '/getMerchant',
    method: 'post',
  })
}
