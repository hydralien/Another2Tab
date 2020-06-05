<template>
	<div class="icon bookmark-item" v-bind:style="style" v-on:click="navigate">
		<a v-bind:href="bookmark.url">
			<font-awesome-icon icon="folder" v-if="isFolder"></font-awesome-icon>
			<img v-bind:src="iconUrl" v-if="!isFolder" v-bind:alt="bookmark.url">
			<pre v-text="bookmark.title"/>
			<input type="hidden" v-bind:value="bookmark.id">
		</a>
	</div>
</template>

<script>
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
			}
		}
	};
</script>
