import React, { Component } from 'react'
import './App.scss'

class App extends Component {
  render() {
    return (
      <div className="app">
        <div className='demo-frame'>
          <iframe title='UI' src='/h5/index.html' frameBorder={0}></iframe>
          <div className='iphone-frame'></div>
        </div>
      </div>
    )
  }
}

export default App
