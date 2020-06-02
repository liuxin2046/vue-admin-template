import { host, request } from '@/utils/request'

export function fetchList() {
  return request({
    url: `${host}/user/allPrivilege`,
    method: 'get'
  })
}

export function getRoleDetail() {
  return request({
    url: `${host}/user/privilege`,
    method: 'get'
  })
}

export function getUserPrivilege() {
  return request({
    url: `${host}/user/userPrivilege`,
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: `${host}/user/roles`,
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: `${host}/vue-element-admin/role`,
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: `${host}/update/role/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `${host}/delete/role/${id}`,
    method: 'delete'
  })
}
