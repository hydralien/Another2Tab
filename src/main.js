import Vue from 'vue';
import App from './App.vue';
import chrome from './components/chrome';

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  chrome
}).$mount('#app');
