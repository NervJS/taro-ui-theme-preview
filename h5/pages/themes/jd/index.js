import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

export default class ThemePage extends Taro.Component {
  config = {
    navigationBarTitleText: 'Taro UI'
  }

  render () {
    return (
      <View className='page page-index'>Themes</View>
    )
  }
}
