import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const privilege = store.getters && store.getters.privilege
    const roles = store.getters && store.getters.roles
    console.log('privilege: ', privilege)
    const permissionRoles = value

    const hasPermission = privilege.some(val => {
      return permissionRoles.includes(val)
    })

    if (!hasPermission && roles !== 'admin') {
      return false
    }
    return true
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}
