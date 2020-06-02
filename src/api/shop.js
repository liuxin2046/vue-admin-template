import { host, request } from '@/utils/request'

export function getList(params) {
  return request({
    url: `${host}/user/shop`,
    method: 'get',
    params
  })
}

export function shelves(params) {
  return request({
    url: `${host}/user/shop`,
    method: 'get',
    params
  })
}

export function takeOff(params) {
  return request({
    url: `${host}/user/shop`,
    method: 'get',
    params
  })
}

export function deleteProduct(params) {
  return request({
    url: `${host}/user/shop`,
    method: 'get',
    params
  })
}

export function getWork() {
  return request({
    url: `${host}/api/v0/work`,
    method: 'get'
  })
}

export function getBanners(id) {
  return request({
    url: `http://10.0.0.11:8082/api/admin/carousel/${id}`
  })
}
