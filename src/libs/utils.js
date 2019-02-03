/**
 * Utils
 */

/**
 * 下载指定的资源
 * @param {String} url 资源地址
 */
function getFileByUrl (url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) return
      if (xhr.status === 200) {
        const urlArr = xhr.responseURL.split('/')
        resolve({
          url: urlArr[urlArr.length - 1],
          data: xhr.response,
        })
      } else {
        reject(new Error(xhr.statusText))
      }
    }

    xhr.open('GET', url)
    xhr.send()
  })
}

/**
 * 生成样式的模板字符串
 * @param {String} data 原始的样式文本
 */
function getStyleTemplateByData (data) {
  const colorMap = {
    '#6190E8': '@color-brand-base',
    '#78A4F4': '@color-brand-light',
    '#346FC2': '@color-brand-dark',
    '97,144,232': '@color-brand-base-rgb',
    '120,164,244': '@color-brand-light-rgb',
    '52,111,194': '@color-brand-dark-rgb',
    // '#333': '@color-text-base',
    // '#fff': '@color-bg',
  }
  let styleTmpl = data || ''

  Object.keys(colorMap).forEach(key => {
    styleTmpl = styleTmpl.replace(new RegExp(key, 'ig'), colorMap[key])
  })
  return styleTmpl
}

function getContrastRating (accessibility) {
  if (accessibility['aaaLarge']) {
    return 'AAA Large'
  } else if (accessibility['aaa']) {
    return 'AAA'
  } else if (accessibility['aaLarge']) {
    return 'AA Large'
  } else if (accessibility['aa']) {
    return 'AA'
  } else {
    return 'Fail'
  }
}

export {
  getFileByUrl,
  getStyleTemplateByData,
  getContrastRating,
}
