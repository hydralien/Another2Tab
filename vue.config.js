const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	publicPath: '',
	configureWebpack: {
		plugins: [
			new CopyPlugin({
				patterns: [
					{from: 'manifest.json', to: ''},
					{from: 'init.json', to: ''}
				]
			})
		]
	}
}