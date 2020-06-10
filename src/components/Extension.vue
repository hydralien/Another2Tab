<template>
	<div class="icon extension-item" v-bind:style="style" v-on:click="navigate">
		<a v-bind:title="extension.name">
			<img v-bind:src="iconUrl" v-bind:origin="extension.id" v-bind:alt="extension.name">
			<p v-text="extension.name"/>
			<input type="hidden" v-bind:value="extension.id">
		</a>
	</div>
</template>

<script>
	export default {
		props: {
			extension: Object,
			settings: Object
		},
		computed: {
			iconUrl: function () {
				return "chrome://extension-icon/" + this.extension.id + "/128/1";
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
				if (this.extension.launchType) {
					this.$chrome.management.launchApp(this.extension.id);
				} else {
					this.$chrome.tabs.create({url: this.extension.optionsUrl});
				}
				window.close();
			}
		}
	};
</script>
