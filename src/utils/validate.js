import { Message } from 'element-ui'
/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * 图片上传
 * @param {file} file el-upload文件对象
 * @param {number} size 限制的文件大小(kb)
 */
export function validImgUpload(file, size) {
  const isSizeOut = file.size / 1024 > size
  if (isSizeOut) {
    Message.error('上传图片大小不能超过' + (size / 1024).toFixed(2) + 'M')
  }
  return !isSizeOut
}
