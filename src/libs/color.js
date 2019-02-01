import color from 'css-color-function'
import rgbHex from 'rgb-hex'

const colorFormula = {
  '@color-brand-base-rgb': 'color(primary)',
  '@color-brand-light-rgb': 'color(primary tint(25%))',
  '@color-brand-dark-rgb': 'color(primary shade(20%))',
  '@color-brand-base': 'color(primary)',
  '@color-brand-light': 'color(primary tint(25%))',
  '@color-brand-dark': 'color(primary shade(20%))',
}

/**
 * 根据主色生成品牌色
 * @param {String} primaryColor 主色
 */
function generateColors (primaryColor) {
  let colors = {}

  Object.keys(colorFormula).forEach(key => {
    const value = colorFormula[key].replace(/primary/g, primaryColor)
    const rgbColor = color.convert(value)

    if (/-rgb$/.test(key)) { // RGB
      const rexpMatch = rgbColor.match(/\(([\S|\s]+)\)/i) || []
      if (!rexpMatch.length) return
      colors[key] = rexpMatch[1]
    } else { // Hex
      colors[key] = `#${rgbHex(rgbColor)}`
    }
  })

  return colors
}

export default generateColors
