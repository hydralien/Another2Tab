import Vue from 'vue'

Vue.mixin( {
	beforeCreate() {
		const options = this.$options;
		if ( options.chrome )
			this.$chrome = options.chrome;
		else if ( options.parent && options.parent.$chrome )
			this.$chrome = options.parent.$chrome;
		// eslint-disable-next-line no-undef
		else if (browser) {
			// eslint-disable-next-line no-undef
			this.$chrome = browser
		}

		this.$tr = this.$chrome.i18n.getMessage;
	},
	methods: {
		tr(tagName, params) {
			return this.$chrome.i18n.getMessage(tagName, params);
		}
	}
} );

// eslint-disable-next-line no-undef
export default chrome;