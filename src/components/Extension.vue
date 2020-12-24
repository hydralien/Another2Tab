<template>
  <div class="m-0 p-2 icon-wrapper">
    <a v-bind:title="extension.name">
      <div class="p-2 row m-0 icon bookmark-item" v-on:click="navigate">
        <div class="py-0 pl-0 pr-1 col-2 icon-image-side">
          <img v-bind:src="iconUrl" v-bind:origin="extension.id" v-bind:alt="extension.name">
        </div>
        <div class="py-0 pl-1 pr-0 col-10 icon-name-side">
          {{ extension.name }}
          <input type="hidden" v-bind:value="extension.id">
        </div>
      </div>
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
