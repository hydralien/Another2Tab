import Vue from 'vue'

Vue.mixin( {
	beforeCreate() {
		const options = this.$options;
		if ( options.chrome )
			this.$chrome = options.chrome;
		else if ( options.parent && options.parent.$chrome )
			this.$chrome = options.parent.$chrome;
	}
} );

// eslint-disable-next-line no-undef
export default chrome;