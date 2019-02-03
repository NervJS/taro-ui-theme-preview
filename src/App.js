import React, { Component } from 'react'
import { SketchPicker } from 'react-color'
import classnames from 'classnames'
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import colorable from 'colorable'
import round from 'lodash/round'
import { getFileByUrl, getStyleTemplateByData, getContrastRating } from './libs/utils'
import generateColors from './libs/color'
import './App.scss'

import taroLogo from './assets/logo-taro.png'

class App extends Component {
  state = {
    demoStyleTmpl: '',
    originStyleTmpl: '',
    themeFile: {},
    currentColor: '#6190E8',
    colorList: ['#6190E8', '#424143', '#FFC701', '#E93B3D'],
    customColor: '#157EFF',
    colors: {}, // 配色方案
    darkContrastScore: '',
    darkContrastRate: '',
    lightContrastScore: '',
    lightContrastRate: '',
    displayColorPicker: false,
  }

  handleBtnBack () {
    const hasPrev = !!this.demoFrameDom.location.hash
    if (hasPrev) {
      this.demoFrameDom.history.back()
    }
  }

  updateCurrentColor (color) {
    const lightContrastObj = colorable([color, '#FFF'])[0].combinations[0]
    const darkContrastObj = colorable([color, '#000'])[0].combinations[0]
    const lightContrastScore = round(lightContrastObj.contrast, 2)
    const darkContrastScore = round(darkContrastObj.contrast, 2)

    this.setState({
      currentColor: color,
      colors: generateColors(color),
      darkContrastScore,
      lightContrastScore,
      darkContrastRate: getContrastRating(darkContrastObj.accessibility),
      lightContrastRate: getContrastRating(lightContrastObj.accessibility),
    })
  }

  handlePickerChange (color) {
    const newColor = color.hex || ''
    if (newColor) {
      this.setState({
        customColor: newColor
      })
      this.updateCurrentColor(newColor)
    }
  }

  handlePickerBtnClick () {
    this.setState({
      displayColorPicker: !this.state.displayColorPicker
    })
  }

  handleMaskClick () {
    this.setState({
      displayColorPicker: false
    })
  }

  changeTheme () {
    let cssText = this.state.demoStyleTmpl
    cssText = this.replaceThemeVariables(cssText)

    this.insertCustomTheme('custom-theme-style', cssText)
  }

  downloadTheme () {
    const { currentColor, themeFile, originStyleTmpl } = this.state
    this.zip = new JSZip()

    const themeCSSText = this.replaceThemeVariables(originStyleTmpl)
    const themeVariablesText = this.replaceThemeVariables(themeFile.data)

    this.zip.file('taro-ui.css', themeCSSText)
    this.zip.file(themeFile.url, themeVariablesText)
    this.zip.generateAsync({ type: 'blob' })
      .then(blob => {
        FileSaver.saveAs(blob, `taro-ui_${currentColor}.zip`)
      })
  }

  replaceThemeVariables (style) {
    const { colors } = this.state
    let cssText = style

    Object.keys(colors).forEach(key => {
      cssText = cssText.replace(new RegExp(key, 'g'), colors[key])
    })

    return cssText
  }

  insertCustomTheme (idName, style) {
    if (!idName) return
    const insertedEle = this.demoFrameDom.document.querySelector(`#${idName}`)

    if (insertedEle) {
      insertedEle.innerHTML = style
    } else {
      const customStyle = document.createElement('style')
      customStyle.type = 'text/css'
      customStyle.id = idName
      customStyle.innerHTML = style

      this.demoFrameDom.document.querySelector('head').appendChild(customStyle)
    }
  }

  getDemoStyleTmpl () {
    getFileByUrl(`${process.env.PUBLIC_URL}/h5/css/app.css`)
      .then(({ url, data }) => {
        this.setState({
          demoStyleTmpl: getStyleTemplateByData(data)
        })
      })
  }

  getUIStyleTmpl () {
    getFileByUrl('https://taro-ui.aotu.io/h5/css/theme_index.css')
      .then(({ url, data }) => {
        this.setState({
          originStyleTmpl: getStyleTemplateByData(data)
        })
      })
  }

  getThemeFileTmpl () {
    getFileByUrl(`${process.env.PUBLIC_URL}/custom-theme.scss`)
      .then(file => {
        this.setState({
          themeFile: file
        })
      })
  }

  componentDidMount () {
    this.updateCurrentColor(this.state.currentColor)
    this.getDemoStyleTmpl()
    this.getUIStyleTmpl()
    this.getThemeFileTmpl()
    this.demoFrame = document.querySelector('#J-demo')
    this.demoFrameDom = this.demoFrame.contentWindow
  }

  render() {
    const {
      colorList,
      customColor,
      currentColor,
      displayColorPicker,
      darkContrastScore,
      lightContrastScore,
      darkContrastRate,
      lightContrastRate,
    } = this.state

    return (
      <div className='app'>
        <div className="logo-cnt">
          <a href='https://taro-ui.aotu.io/#/' target='__blank'>
            <img className='logo-img' alt='Taro UI' src={taroLogo} />
            <span>Taro UI</span>
          </a>
        </div>

        <div className='container'>
          <div className='panel-left'>
            {/* Taro UI Demo 展示页 */}
            <div className='demo-frame'>
              <iframe id='J-demo' title='UI' src={`${process.env.PUBLIC_URL}/h5/index.html`} frameBorder={0}></iframe>
              <div className='navbar'>
                <div className='navbar__btn-back' onClick={this.handleBtnBack.bind(this)}>
                  <svg t='1548917697699' className='icon' viewBox='0 0 1024 1024' version='1.1'>
                    <path d='M348.8 512L742.4 118.4c12.8-12.8 12.8-32 0-44.8s-32-12.8-44.8 0l-416 416c-12.8 12.8-12.8 32 0 44.8l416 416c6.4 6.4 16 9.6 22.4 9.6s16-3.2 22.4-9.6c12.8-12.8 12.8-32 0-44.8L348.8 512z' p-id='4990'></path>
                  </svg>
                </div>
                <div className='navbar__title'>Taro UI</div>
              </div>
              <div className='iphone-frame'></div>
            </div>
          </div>

          <div className='panel-right'>
            <div className='info'>
              <div className='subtitle'>Taro UI</div>
              <div className='title'>自定义主题生成器</div>
              <div className='desc'>请选择一个主色，工具会自动生成一套适配 Taro UI 的主题配色方案<br />主题文件的使用方式请查看<a href='https://taro-ui.aotu.io/#/docs/customizetheme' target='__blank'>「自定义主题」</a>文档</div>

              <div className='color-palette'>
                <div className='color-list'>
                  {colorList.map(item => (
                    <div
                      key={item}
                      className={classnames('color-list__item', {
                        'color-list__item--active': currentColor === item
                      })}
                      style={{ background: item }}
                      onClick={this.updateCurrentColor.bind(this, item)}
                    ></div>
                  ))}
                </div>
                <div className='color-picker-wrapper'>
                  <div
                    className={classnames('color-picker', { 'color-picker--active' :  customColor === currentColor })}
                    onClick={this.handlePickerBtnClick.bind(this)}
                  >
                    <div className='selected-color' style={{ background: customColor }}></div>
                    <span>自定义</span>
                  </div>
                  {displayColorPicker && (
                    <div className='popup-picker'>
                      <div className='popup-picker__mask' onClick={this.handleMaskClick.bind(this)}></div>
                      <SketchPicker
                        color={ customColor }
                        presetColors={[]}
                        onChangeComplete={this.handlePickerChange.bind(this)}
                        disableAlpha
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Color Contrast Value */}
              <div className='color-contrast'>
                <div className='color-contrast__value color-contrast__value--dark' style={{ color: currentColor }}><span>{darkContrastScore}</span>{darkContrastRate}</div>
                <div className='color-contrast__value  color-contrast__value--light' style={{ color: currentColor }}><span>{lightContrastScore}</span>{lightContrastRate}</div>
                <a className='info' href='https://www.w3.org/TR/WCAG20/#visual-audio-contrast' target='__blank'>-- WCAG 2.0 标准</a>
              </div>

              <div className='result-cnt'>
                <div className='result-cnt__color'>
                  <div className='result-cnt__color-bar' style={{ background: currentColor }}></div>
                  <div className='result-cnt__color-text'>{currentColor}</div>
                </div>

                {/* 操作按钮 */}
                <div className='result-cnt__btns'>
                  <div className='result-cnt__btn result-cnt__btn--preview' onClick={this.changeTheme.bind(this)}>
                    <svg t='1548906434794' className='icon' viewBox='0 0 1024 1024' version='1.1'>
                      <path d='M896 96H128c-35.2 0-64 28.8-64 64v512c0 35.2 28.8 64 64 64h352v128h-160c-19.2 0-32 12.8-32 32s12.8 32 32 32h384c19.2 0 32-12.8 32-32s-12.8-32-32-32h-160v-128h352c35.2 0 64-28.8 64-64V160c0-35.2-28.8-64-64-64z m0 576H128V160h768v512z' p-id='2470'></path>
                    </svg>
                    预览
                  </div>
                  <div className='result-cnt__btn result-cnt__btn--download' onClick={this.downloadTheme.bind(this)}>
                    <svg t='1548914158885' className='icon' viewBox='0 0 1024 1024' version='1.1'>
                      <path d='M928 512c-19.2 0-32 12.8-32 32v256H128v-256c0-19.2-12.8-32-32-32s-32 12.8-32 32v252.8C64 832 92.8 864 128 864h768c35.2 0 64-32 64-67.2V544c0-19.2-12.8-32-32-32z' p-id='4873'></path><path d='M726.4 425.6c-12.8-12.8-32-12.8-44.8 0L544 563.2V192c0-19.2-12.8-32-32-32s-32 12.8-32 32v371.2l-137.6-137.6c-12.8-12.8-32-12.8-44.8 0s-12.8 32 0 44.8l192 192c3.2 3.2 6.4 6.4 9.6 6.4 3.2 3.2 9.6 3.2 12.8 3.2s9.6 0 12.8-3.2c3.2-3.2 6.4-3.2 9.6-6.4l192-192c12.8-12.8 12.8-32 0-44.8z' p-id='4874'></path>
                    </svg>
                    下载主题
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App
