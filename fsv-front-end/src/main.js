import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store.js'

Vue.prototype.$baseUrl = process.env.VUE_APP_BASE_URL;

Vue.config.productionTip = false

new Vue({
  router,
  store,
  created() {
    this.$store.dispatch('loadUserData');

  },
  render: h => h(App)
}).$mount('#app')

