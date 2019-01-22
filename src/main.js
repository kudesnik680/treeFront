import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import axios from 'axios'

axios.defaults.baseURL = 'http://one.bit';
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
