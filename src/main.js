import Vue from 'vue';
import App from './App.vue';
import chrome from './components/chrome';
import {library} from '@fortawesome/fontawesome-svg-core'
import {
	faPencilRuler,
	faPen,
	faSlidersH,
	faTrash,
	faCookieBite,
	faCog,
	faCogs,
	faKey,
	faBookmark,
	faSyncAlt
} from '@fortawesome/free-solid-svg-icons'
import{
	faFolder,
	faFolderOpen
} from '@fortawesome/free-regular-svg-icons'
import {faChrome} from '@fortawesome/free-brands-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
// import "node_modules/bootstrap/scss/bootstrap.scss"

library.add(
	faPencilRuler,
	faPen,
	faSlidersH,
	faChrome,
	faCogs,
	faCog,
	faCookieBite,
	faTrash,
	faKey,
	faBookmark,
	faSyncAlt,
	faFolder,
	faFolderOpen
)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false;
Vue.prototype.$chrome = chrome || {};

new Vue({
	render: h => h(App)
}).$mount('#app');
