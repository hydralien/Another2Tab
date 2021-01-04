import Vue from 'vue'

Vue.mixin( {
	beforeCreate() {
		// const options = this.$options;
		// if ( options.chrome )
		// 	chrome = options.chrome;
		// else if ( options.parent && options.parent.$chrome )
		// 	chrome = options.parent.$chrome;
		// // eslint-disable-next-line no-undef
		// else if (chrome) {
		// 	// eslint-disable-next-line no-undef
		// 	chrome = chrome
		// }
		// // eslint-disable-next-line no-undef
		// else if (browser) {
		// 	// eslint-disable-next-line no-undef
		// 	chrome = browser
		// }
		// eslint-disable-next-line no-undef
		// chrome = chrome
		// eslint-disable-next-line no-undef
		// this.$tr = chrome.i18n.getMessage;
	},
	methods: {
		tr(tagName, params) {
			return chrome.i18n.getMessage(tagName, params);
		}
	}
} );

// eslint-disable-next-line no-undef
// export default chrome;