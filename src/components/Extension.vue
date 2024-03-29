<template>
  <div class="m-0 p-2 icon-wrapper">
    <a v-bind:title="extension.name" :class="[!extension.enabled ? 'disabled' : '']">
      <div class="row m-0 icon bookmark-item extension-item" v-on:click="navigate" :style="extensionStyle">
        <div class="p-0 pl-0 pr-1 col-2 icon-image-side">
          <img v-bind:src="iconUrl" v-bind:origin="extension.id" v-bind:alt="extension.name">
        </div>
        <div class="py-0 pl-1 pr-0 col-10 icon-name-side">
          <span v-if="!extension.enabled">[DISABLED]</span> {{ extension.name }}
          <input type="hidden" v-bind:value="extension.id">
        </div>
      </div>
    </a>
  </div>
</template>

<script>
import {Component, Prop} from 'vue-property-decorator'
import Bookmark from './Bookmark.vue'
import Browser, {browserType, FIREFOX} from "@/browser";

export default @Component
class Extension extends Bookmark {
  @Prop({type: Object, required: true})
  extension

  get iconUrl() {
    const icons = [...this.extension.icons]
    if (icons.length === 0) return ""
    icons.sort((a, b) => b.size - a.size)
    const maxIcon = icons[0]
    return maxIcon.url;
  }

  get extensionStyle() {
    const bookmarkStyle = this.bookmarkStyle
    bookmarkStyle['cursor'] = 'pointer'
    return bookmarkStyle
  }

  navigate() {
    if (this.editMode) {
      this.$emit('edit', this.extension)
      return;
    }
    if (!this.extension.enabled) return

    if (this.extension.isApp) {
      return Browser.management.launchApp(this.extension.id);
    } else {
      const extUrl = this.extension.optionsUrl || this.extension.homepageUrl
      if (extUrl) {
        return Browser.tabs.create({url: extUrl});
      }
      if (browserType() === FIREFOX) {
        Browser.search.search({
          query: '',
          engine: this.extension.name
        })
      }
    }
    // window.close();
  }
}
</script>

<style lang="scss" scoped>
.disabled .bookmark-item {
  background-color: lightgray;
  cursor: default;
}
</style>
