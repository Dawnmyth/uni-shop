
// #ifndef VUE3
import Vue from 'vue'
import App from './App'

// 导入uniapp网络请求的第三方包
import {$http} from '@escook/request-miniprogram'

uni.$http = $http

// 定义根路径
$http.baseUrl = 'https://api-hmugo-web.itheima.net'

// 全局定义请求失败的弹框方法
uni.$showMsg = function (title = '请求失败！', duration = 1500){
  uni.showToast({
    title,
    duration,
    icon: 'none'
  })} 

// 请求拦截器
$http.beforeRequest = function(options) {
  uni.showLoading({
    title:"加载中"
  })
}

// 响应拦截器
$http.afterRequest = function(options) {
  uni.hideLoading()
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif