<template>
  <main id="app" :style="appStyle">
    <Modal :visible.sync="chromeRestartVisible" @close="chromeRestartVisible=false">
      <template slot="header">{{ tr("chrome_reload") }}</template>

      <p class="text-left">
        {{ tr(explanationTag) }}
      </p>
      <div class="input-group mb-3 form-group">
        <label for="chrome-restart-url" class="sr-only">Internal page link</label>
        <input id="chrome-restart-url" class="form-control" readonly="readonly" :value="chromeRestartUrl"/>
        <div class="input-group-append">
          <button class="btn btn-primary" v-clipboard="chromeRestartUrl" @success="copyTextChange">{{
              copyText
            }}
          </button>
        </div>
      </div>

      <template slot="footer">
        <button class="btn btn-outline-primary" @click="chromeRestartVisible=false">OK</button>
      </template>
    </Modal>

    <Modal :visible.sync="appInfoVisible" @close="appInfoVisible=false">
      <template slot="header">{{ tr("app_info") }}</template>

      <div class="m-1 text-left">
        <h5>{{ tr("app_dev") }}</h5>
        <ul>
          <li>
            <a href="https://hydralien.net" target="_blank">Boris Turchik</a>
          </li>
        </ul>

        <h5>{{ tr("design_guidance") }}</h5>
        <ul>
          <li>
            <a href="http://www.elenaborisova.com/" target="_blank">Elena Borisova</a>
          </li>
        </ul>

        <h5>{{ tr("tech_used") }}</h5>
        <ul>
          <li><a href="https://vuejs.org/" target="_blank">Vue.js</a></li>
          <li><a href="https://nodejs.org/en/" target="_blank">Node.js</a></li>
          <li><a href="https://fontawesome.com/" target="_blank">Font Awesome</a></li>
          <li><a href="https://getbootstrap.com/" target="_blank">Bootstrap</a></li>
        </ul>
      </div>

      <template slot="footer">
        <button class="btn btn-outline-primary" @click="appInfoVisible=false">OK</button>
      </template>
    </Modal>

    <section id="settings-container" :class="[settingsVisible ? 'settings-open' : '']" :style="menuStyle">
      <h3>
        AnotherTab
      </h3>
      <ul class="action-list">
        <li>
          <a v-on:click="toggleEdit">
            <font-awesome-icon icon="pen"></font-awesome-icon>
            {{ tr("edit") }}
          </a>
          <div :class="['edit-mode-info', 'app-settings', editMode ? 'app-settings-visible' : '']">
            <p>
              {{ tr("edit_mode_message") }}
            </p>
          </div>
        </li>
        <li>
          <a @click="appSettingsVisible=!appSettingsVisible">
            <font-awesome-icon icon="cog"></font-awesome-icon>
            {{ tr("settings") }}
          </a>
          <div :class="['app-settings', appSettingsVisible ? 'app-settings-visible' : '']">
            <div class="form-group">
              <h6>{{ tr("tile_size") }}</h6>
              <ul class="radio-list">
                <li>
                  <input type="radio" class="" id="tile-size-selector-small" value="size-small"
                         v-model="settings.sync.tileSize"/>
                  <label for="tile-size-selector-small" class=""> {{ tr("size_small") }}</label>
                </li>
                <li>
                  <input type="radio" class="" id="tile-size-selector-medium" value="size-medium"
                         v-model="settings.sync.tileSize"/>
                  <label for="tile-size-selector-medium" class=""> {{ tr("size_medium") }}</label>
                </li>
                <li>
                  <input type="radio" class="" id="tile-size-selector-large" value="size-large"
                         v-model="settings.sync.tileSize"/>
                  <label for="tile-size-selector-large" class=""> {{ tr("size_large") }}</label>
                </li>
              </ul>
            </div>
            <div class="form-group">
              <h6><label for="background-color-selector">{{ tr("bgcolor") }}</label></h6>
              <input class="form-control" id="background-color-selector" type="color"
                     v-model="settings.sync.backgroundColor">
              <h6>
                <label for="background-image-selector">{{ tr("bgimage") }}</label>
                <a @click="imageUrlHint = !imageUrlHint" class="ml-1">ⓘ</a>
              </h6>
              <p class="image-url-hint" v-if="imageUrlHint">
                {{ tr("image_url_hint") }}
              </p>
              <input class="form-control" id="background-image-selector" type="text"
                     v-model="settings.sync.backgroundImageUrl">
            </div>
            <div class="form-group" v-if="!isFirefox">
              <input id="check-use-google-icons" type="checkbox" class="form-check-inline"
                     v-model="settings.sync.useGoogleIconService"/>
              <label for="check-use-google-icons" class="form-check-label">{{ tr("use_google_icons") }}</label>
            </div>
            <div class="form-group">
              <input id="display-sidebar-shortcuts" type="checkbox" class="form-check-inline"
                     v-model="settings.sync.displaySidebarShortcuts"/>
              <label for="display-sidebar-shortcuts" class="form-check-label">{{
                  tr("display_sidebar_shortcuts")
                }}</label>
            </div>
            <button class="btn btn-primary" @click="saveSettings">{{ tr("save_settings") }}</button>
          </div>
        </li>
        <li>
          <a @click="appInfoVisible=!appInfoVisible">
            <font-awesome-icon icon="info-circle"></font-awesome-icon>
            {{ tr("app_info") }}
          </a>
        </li>
        <li>
          <a :href="`mailto:hydra.public@gmail.com?subject=Feedback for AnotherTab (${browserType})`">
            <font-awesome-icon icon="envelope"></font-awesome-icon>
            {{ tr("app_feedback") }}
          </a>
        </li>
      </ul>
      <h3 class="mt-3">{{ tr("browser") }}</h3>
      <ShortcutsBlock :icons-only="false" @reload="restart"/>

      <div class="references text-center">
        <!--        by-->
        <!--        <a href="https://hydralien.net" target="_blank">Boris Turchik</a>-->
        <!--        <a href="http://www.elenaborisova.com/" target="_blank">Elena Borisova</a>-->
      </div>
    </section>


    <section id="controls-container" :style="menuStyle">
      <a id="settings-trigger" v-on:click="toggleSettings" class="settings-trigger" :title="tr('settings')">
        <font-awesome-icon icon="cogs"></font-awesome-icon>
      </a>
      <a id="edit-trigger" v-on:click="toggleEdit"
         :class="['shortcut-secondary', !settingsVisible ? 'shortcut-secondary-visible' : '', editMode ? 'shortcut-secondary-active' : '']"
         :title="tr('edit')"
      >
        <font-awesome-icon icon="pen"></font-awesome-icon>
      </a>
      <ShortcutsBlock :icons-only="true" :secondary-icons-class="secondaryIconsClass" @reload="restart"/>
    </section>

    <section id="bookmarks-and-extensions" :class="['size-medium', settings.sync.tileSize]">
      <BookmarksBlock ref="bookmarksBlock" v-bind:settings="settings" :rootNode="settings.sync.bookmarksRootNode"
                      :edit-mode="editMode"></BookmarksBlock>

      <ExtensionsBlock ref="extensionsBlock" v-bind:settings="settings" :edit-mode="editMode"></ExtensionsBlock>
    </section>
  </main>
</template>

<script>
import BookmarksBlock from "@/components/BookmarksBlock";
import ExtensionsBlock from "@/components/ExtensionsBlock";
import Modal from "@/components/Modal";
import Settings from "@/components/settings"
import {Vue, Watch, Ref, Component} from 'vue-property-decorator'
import ShortcutsBlock from "@/components/ShortcutsBlock"
import { browserType, FIREFOX } from "@/browser";

export default @Component({
  components: {
    BookmarksBlock,
    ExtensionsBlock,
    ShortcutsBlock,
    Modal
  }
})
class App extends Vue {
  settings = new Settings()
  editMode = false
  settingsVisible = false
  appSettingsVisible = false
  appInfoVisible = false
  chromeRestartVisible = false
  imageUrlHint = false
  chromeRestartUrl = "chrome://restart/"
  explanationTag = "chrome_reload_explanation"
  copyText = this.tr("copy_action")
  isFirefox = browserType() === FIREFOX
  browserType = browserType()

  @Ref('bookmarksBlock')
  bookmarksBlock

  @Ref('extensionsBlock')
  extensionsBlock

  get menuStyle() {
    return {
      'opacity': (this.settingsVisible ? 1 : (this.settings.sync.backgroundImageUrl ? 0.8 : 1))
    }
  }

  get appStyle() {
    const styles = {
      'background-color': this.settings.sync.backgroundColor,
      'background-repeat': 'no-repeat',
      'background-size': 'cover'
    }
    if (this.settings.sync.backgroundImageUrl) {
      styles['background-image'] = `url("${this.settings.sync.backgroundImageUrl}")`
    }

    return styles
  }

  get secondaryIconsClass() {
    return [
      'shortcut-secondary',
      !this.settingsVisible && this.settings.sync.displaySidebarShortcuts ? 'shortcut-secondary-visible' : ''
    ]
  }

  @Watch('settings.sync.useGoogleIconService')
  useGoogleIconServiceChange() {
    this.settings.current.iconReload = true

    this.bookmarksBlock.bookmarks = []
    this.bookmarksBlock.loadBookmarks()
  }

  toggleSettings() {
    this.settingsVisible = !this.settingsVisible
  }

  toggleEdit() {
    this.editMode = !this.editMode;
  }

  saveSettings() {
    this.settings.current.iconReload = false
    this.settings.saveSyncSettings();
  }

  restart(restartUrl, explanationTag) {
    if (restartUrl) this.chromeRestartUrl = restartUrl
    if (explanationTag) this.explanationTag = explanationTag
    this.chromeRestartVisible = true
  }

  copyTextChange() {
    const prevCopyText = this.copyText;
    this.copyText = this.tr("copied_action");
    setTimeout(() => {
      this.copyText = prevCopyText;
    }, 2000);
  }
}
</script>

<style lang="scss" src="./App.scss">
</style>
