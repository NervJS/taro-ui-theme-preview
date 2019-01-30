import React, { Component } from 'react'
import './App.scss'

class App extends Component {
  constructor () {
    super(...arguments)

    this.state = {
      originStyleTmpl: ''
    }
  }

  changeTheme () {
    const { originStyleTmpl } = this.state
    this.insertCustomTheme(originStyleTmpl)
  }

  insertCustomTheme (style) {
    const customStyle = document.createElement('style')
    customStyle.type = 'text/css'
    customStyle.innerHTML = style

    const demoFrame = document.querySelector('#J-demo')
    const iframeDom = demoFrame.contentWindow
    iframeDom.document.querySelector('head').appendChild(customStyle)
  }

  getUIStyle () {
    this.getFile(`${process.env.PUBLIC_URL}/h5/css/app.css`)
      .then(({ data }) => {
        this.setState({
          originStyleTmpl: this.getStyleTemplate(data)
        })
      })
  }

  getFile (url) {
    return new Promise((resolve, reject) => {
      const client = new XMLHttpRequest()

      client.onreadystatechange = () => {
        if (client.readyState !== 4) return
        if (client.status === 200) {
          const urlArr = client.responseURL.split('/')
          resolve({
            data: client.response,
            url: urlArr[urlArr.length - 1]
          })
        } else {
          reject(new Error(client.statusText))
        }
      }

      client.open('GET', url)
      client.send()
    })
  }

  getStyleTemplate (data) {
    const colorMap = {
      '#e93b3d': '#6190E8',
    }

    Object.keys(colorMap).forEach(key => {
      const value = colorMap[key]
      data = data.replace(new RegExp(key, 'ig'), value)
    })

    return data
  }

  componentDidMount () {
    this.getUIStyle()
  }

  render() {
    return (
      <div className="app">
        <div className='container'>
          {/* Taro UI Demo 展示页 */}
          <div className='demo-frame'>
            <iframe id='J-demo' title='UI' src='/h5/index.html' frameBorder={0}></iframe>
            <div className='iphone-frame'></div>
          </div>

          {/* 操作按钮 */}
          <div className='panel-right'>
            <div className='btn-change-theme' onClick={this.changeTheme.bind(this)}>官方主题</div>
          </div>
        </div>
      </div>
    )
  }
}

export default App
