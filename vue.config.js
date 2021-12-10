const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	publicPath: '',
	pages: {
		index: {
			entry: 'src/main.js',
			title: "AnotherTab"
		}
	},
	configureWebpack: {
		devtool: 'cheap-module-source-map',
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