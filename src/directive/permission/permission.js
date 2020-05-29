import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const privilege = store.getters && store.getters.privilege
    const roles = store.getters && store.getters.roles
    if (value && value instanceof Array && value.length > 0) {
      const permissionRoles = value

      const hasPermission = privilege.some(val => {
        return permissionRoles.includes(val)
      })

      if (!hasPermission && roles !== 'admin') {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need roles! Like v-permission="['admin','editor']"`)
    }
  }
}
