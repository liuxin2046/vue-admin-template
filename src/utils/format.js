// 图片地址处理
// type值为阿里图片处理的样式名称,
// 目前格式类型有: 压缩80%的原图: origin, 封面图: cover, 缩略图: thumbnail, 原图admin
// TODO
export function formatImage(url, type = 'cover') {
  const host = 'https://img.musicbible.com'
  const isComplete = url.startsWith('http')
  if (isComplete) {
    return url
  } else {
    const hasSlash = url.startsWith('/')
    return hasSlash ? host + url + `?x-oss-process=style/${type}` : host + '/' + url + `?x-oss-process=style/${type}`
  }
}

export function formatMediaPath(url) {
  const host = 'https://media.musicbible.com'
  const isComplete = url.startsWith('http')
  if (isComplete) {
    return url
  } else {
    const hasSlash = url.startsWith('/')
    return hasSlash ? host + url : host + '/' + url
  }
}
// 格式化金额显示
export function addCommasTo(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
