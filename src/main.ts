import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/shared/styles/tokens.css'
import '@/shared/styles/element-theme.css'
import '@/shared/styles/global.css'
import App from '@/app/App.vue'

Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  render: (h) => h(App),
}).$mount('#app')
