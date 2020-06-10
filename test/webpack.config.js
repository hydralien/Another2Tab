const nodeExternals = require('webpack-node-externals')

module.exports = {
	// ...
	externals: [nodeExternals()],
	use: [
		'vue-style-loader',
		'css-loader'
	]
}