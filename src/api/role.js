import request from '@/utils/request'

export function fetchList() {
  return request({
    url: '/user/allPrivilege',
    method: 'get'
  })
}

export function getRoleDetail() {
  return request({
    url: '/user/privilege',
    method: 'get'
  })
}

export function getUserPrivilege() {
  return request({
    url: '/user/userPrivilege',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/user/roles',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/vue-element-admin/role',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: `/update/role/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/delete/role/${id}`,
    method: 'delete'
  })
}
