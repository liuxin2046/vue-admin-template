import { host, request } from '@/utils/request'

export function login(data) {
  return request({
    url: `${host}/user/login`,
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: `${host}/user/info`,
    method: 'get',
    params: { token }
  })
}

export function getPrivilege(token) {
  return request({
    url: `${host}/user/privilege`,
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: `${host}/user/logout`,
    method: 'post'
  })
}
