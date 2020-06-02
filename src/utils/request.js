import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getTokenType, getToken } from '@/utils/auth'

const host = process.env.VUE_APP_BASE_API
// create an axios instance
const request = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
request.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = getTokenType() + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
request.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    if (response.status === 200) {
      return Promise.resolve(response.data)
    } else {
      return Promise.reject(response)
    }
  },
  error => {
    if (error && error.response) {
      const status = error.response.status
      // const data = error.response.data
      // coustom error code
      // const code = data.code
      if (status === 401) {
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('user/logout').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      if (status === 500) {
        Message({
          message: '系统错误,请联系管理员处理',
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        Message({
          message: error.message,
          type: 'error',
          duration: 5 * 1000
        })
      }
      return Promise.reject(error)
    } else {
      Message({
        message: '请求失败，请稍后重试',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }
  }
)

export { host, request }
