import Vue from 'vue';
import App from './App.vue';
// eslint-disable-next-line no-unused-vars
import './components/chrome';
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
	faSyncAlt,
	faInfoCircle,
	faPuzzlePiece,
	faFlag,
	faEnvelope
} from '@fortawesome/free-solid-svg-icons'
import{
	faFolder,
	faFolderOpen
} from '@fortawesome/free-regular-svg-icons'
import {faChrome} from '@fortawesome/free-brands-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import VueClipboards from 'vue-clipboards';

Vue.use(VueClipboards);
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
	faFolderOpen,
	faInfoCircle,
	faPuzzlePiece,
	faFlag,
	faEnvelope
)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false;
// eslint-disable-next-line no-undef
// Vue.prototype.$chrome = chrome


new Vue({
	render: h => h(App)
}).$mount('#app');
