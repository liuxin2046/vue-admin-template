/**
 * 创建唯一的字符串
 * @return {string} ojgdvbvaua40
 */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

export function compressedImage(url) {
  return url + '?x-image-process=image/resize,w_400/imageslim'
}
