import Vue from 'vue';
import App from './App.vue';
import chrome from './components/chrome';
import {library} from '@fortawesome/fontawesome-svg-core'
import {
	faPencilRuler,
	faSlidersH,
	faTrash,
	faCookieBite,
	faCogs,
	faKey,
	faBookmark,
	faSyncAlt,
	faFolder
} from '@fortawesome/free-solid-svg-icons'
import {faChrome} from '@fortawesome/free-brands-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

library.add(
	faPencilRuler,
	faSlidersH,
	faChrome,
	faCogs,
	faCookieBite,
	faTrash,
	faKey,
	faBookmark,
	faSyncAlt,
	faFolder
)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false;

new Vue({
	render: h => h(App),
	chrome
}).$mount('#app');
