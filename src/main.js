import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 自定义全局样式
import './assets/css/global.css'
//其他字体样式
import './assets/fonts/iconfont.css'
// element css样式
import 'element-ui/lib/theme-chalk/index.css'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// 导入NProgress 对应的js和css
import NProgress from 'nprogress'
import TreeTable from 'vue-table-with-tree-grid'


import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  console.log(config, 'config');
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.prototype.$http = axios

Vue.component('tree-table', TreeTable)
// 将富文本编辑器注册为全局组件
Vue.use(VueQuillEditor)
// 全局时间过滤器
Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal)

  Vue.config.productionTip = false

  // 在reponse拦截器中,隐藏进度条 NProgress.done()
  axios.interceptors.response.use(config => {
    NProgress.done()
    return config
  })


  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  // yyyy-mm-dd hh:mm:ss
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')