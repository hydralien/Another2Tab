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
        <div class="py-0 pl-0 pr-1 col-2 icon-image-side">
          <font-awesome-icon :icon="['far', 'folder-open']" v-if="isFolder && bookmark.opened"
                             class="directory"></font-awesome-icon>
          <font-awesome-icon :icon="['far', 'folder']" v-else-if="isFolder && !bookmark.opened"
                             class="directory"></font-awesome-icon>
          <img v-else :src="iconUrl" :origin="bookmark.url" :alt="bookmark.url" @load="iconLoad">
        </div>
        <div class="py-0 pl-1 pr-0 col-10 icon-name-side">
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

  get isFolder() {
    return this.bookmark.url === undefined;
  }

  get iconUrl() {
    return  this.settings.getCachedLocalIcon(this.bookmark.url);
  }

  get bookmarkStyle() {
    const styles = {
      'cursor': this.editMode ? 'grab' : 'pointer'
    }
    if (this.settings.sync.backgroundColor !== '#ffffff' || this.settings.sync.backgroundImageUrl) {
      styles['background-color'] = 'rgba(255,255,255,0.7)'
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
