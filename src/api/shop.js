import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/user/shop',
    method: 'get',
    params
  })
}

export function shelves(params) {
  return request({
    url: '/user/shop',
    method: 'get',
    params
  })
}

export function takeOff(params) {
  return request({
    url: '/user/shop',
    method: 'get',
    params
  })
}

export function deleteProduct(params) {
  return request({
    url: '/user/shop',
    method: 'get',
    params
  })
}

export function getWork() {
  return request({
    url: '/api/v0/work',
    method: 'get'
  })
}
