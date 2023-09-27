import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store.js'

Vue.prototype.$baseUrl = process.env.VUE_APP_BASE_URL;

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
