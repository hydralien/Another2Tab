<template>
	<div class="icon bookmark-item" v-bind:style="style" v-on:click="navigate">
		<a v-bind:href="bookmark.url" v-bind:title="bookmark.title">
			<font-awesome-icon icon="folder" v-if="isFolder"></font-awesome-icon>
			<img v-bind:src="iconUrl" v-bind:origin="bookmark.url" v-if="!isFolder" v-bind:alt="bookmark.url" @load="iconLoad">
			<p v-text="bookmark.title"/>
			<input type="hidden" v-bind:value="bookmark.id">
		</a>
	</div>
</template>

<script>
	const imageToURI = require('image-to-data-uri')

	export default {
		props: {
			bookmark: Object,
			settings: Object
		},
		computed: {
			isFolder: function () {
				return this.bookmark.url === undefined;
			},
			iconUrl: function () {
				let cachedIconContent = this.settings.getCachedLocalIcon(this.bookmark.url);
				if (cachedIconContent != null) {
					return cachedIconContent;
				}
				return "chrome://favicon/" + this.bookmark.url;
			},
			style: function () {
				return {
					width: this.settings.sync.icon.width + 'px',
					height: this.settings.sync.icon.width + 'px',
					backgroundColor: this.settings.sync.icon.backgroundColor,
				};
			}
		},
		methods: {
			navigate() {
				if (this.isFolder) {
					return
				}
				window.location.href = this.bookmark.url;
			},
			iconLoad(iconEvent) {
				let icon = iconEvent.target;
				// eslint-disable-next-line no-debugger
				// debugger;
				// the icon is cached
				if (icon.src.startsWith("data")) {return}
				imageToURI(icon.src, (err, dataUri) => {
					if (!err) {
						let iconOrigin = icon.getAttribute("origin");
						// console.log(iconOrigin, dataUri);
						this.settings.saveCachedLocalIcon(iconOrigin, dataUri);
					} else {
						console.log("Error converting icon image to data URL: " + err);
					}
				});
			}
		}
	};
</script>
