<template>
  <div
      :class="
      ['m-0', 'p-2', 'icon-wrapper',
      bookmark.nestedLevel ? 'icon-nested-' + bookmark.nestedLevel : '',
      bookmark.listPosition ? 'icon-list-position-' + bookmark.listPosition : ''
      ]"
  >
    <a v-bind:href="bookmark.url" v-bind:title="bookmark.title" v-on:click="navigate">
      <div class="row m-0 icon bookmark-item" :style="bookmarkStyle">
        <div class="py-0 pl-0 pr-1 icon-image-side">
          <font-awesome-icon :icon="['far', 'folder-open']" v-if="isFolder && bookmark.opened"
                             class="directory"></font-awesome-icon>
          <font-awesome-icon :icon="['far', 'folder']" v-else-if="isFolder && !bookmark.opened"
                             class="directory"></font-awesome-icon>
          <img v-else :src="iconUrl" :origin="bookmark.url" :alt="bookmark.url" @error="iconFail" @load="iconLoad">
        </div>
        <div class="py-0 pl-1 pr-0 icon-name-side">
          {{ bookmark.title }}
          <input type="hidden" v-bind:value="bookmark.id">
        </div>
      </div>
    </a>
  </div>
</template>

<script>
const imageToURI = require('image-to-data-uri')
import {Vue, Prop, Component} from 'vue-property-decorator'

export default @Component({})
class Bookmark extends Vue {
  @Prop({type: Object, default: () => {}})
  bookmark

  @Prop({type: Number, default: 0})
  index

  @Prop({type: Object, required: true})
  settings

  @Prop({type: Boolean, default: false})
  editMode

  iconFallback = false

  get isFolder() {
    return this.bookmark.url === undefined;
  }

  get iconUrl() {
    if (this.iconFallback) return this.settings.getFallbackIcon(this.bookmark.url)
    return  this.settings.getCachedLocalIcon(this.bookmark.url);
  }

  hexToRGB(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } else {
      return `rgb(${r}, ${g}, ${b})`;
    }
  }

  rgbSum(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return r + g + b
  }

  get bookmarkStyle() {
    const styles = {
      'cursor': this.editMode ? 'grab' : 'pointer'
    }
    let alpha = 1
    if (this.settings.sync.backgroundColor !== '#ffffff' || this.settings.sync.backgroundImageUrl) {
      alpha = 0.7
    }
    styles['background-color'] = `rgba(255,255,255,${alpha})`
    if (this.bookmark && this.settings.sync.highlightedIcons[this.bookmark.id]) {
      const bgColor = this.settings.sync.highlightedIcons[this.bookmark.id]
      styles['background-color'] = this.hexToRGB(bgColor, alpha)
      if (this.rgbSum(bgColor) < (255*3)/2) styles['color'] = '#ffffff'
    }

    return styles
  }

  navigate(event) {
    if (this.editMode) {
      event.preventDefault()
      this.$emit('edit', this.bookmark)
      return
    }
    if (this.isFolder) {
      this.$emit('directoryToggle', this.$props.index)
    }
    // window.location.href = this.bookmark.url;
  }

  iconFail(iconEvent) {
    let icon = iconEvent.target
    if (!icon.src.startsWith('chrome')) this.iconFallback = true // if it's chrome URL already, there's nothing to fall back to
  }

  iconLoad(iconEvent) {
    let icon = iconEvent.target;
    // eslint-disable-next-line no-debugger
    // debugger;
    // the icon is cached
    if (icon.src.startsWith("data")) {
      return
    }
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
</script>
