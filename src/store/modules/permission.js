import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param privileges
 * @param route
 */
function hasPermission(privileges, route) {
  if (route.meta && route.meta.privileges) {
    return privileges.some(role => route.meta.privileges.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param privileges
 */
export function filterAsyncRoutes(routes, privileges) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(privileges, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, privileges)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit, rootState }, privileges) {
    console.log('rootState: ', rootState.user.roles)
    const roles = rootState.user.roles
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
        console.log('isAdmin: ')
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, privileges)
        console.log('accessedRoutes: ', accessedRoutes)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
