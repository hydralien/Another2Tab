<template>
  <main id="app">
    <section id="settings-container" :class="[settingsVisible ? 'settings-open' : '']">
      <h3>
        AnotherTab
      </h3>
      <ul class="action-list">
        <li>
          <a v-on:click="toggleEdit">
            <font-awesome-icon icon="pencil-ruler"></font-awesome-icon>
            {{ tr("edit") }}
          </a>
        </li>
        <li>
          <a>
            <font-awesome-icon icon="cog"></font-awesome-icon>
            {{ tr("settings") }}
          </a>
        </li>
      </ul>
      <h3 class="mt-3">Chrome</h3>
      <ul class="action-list">
        <li>
          <a v-on:click="navigate('chrome://extensions/')">
            <font-awesome-icon :icon="['fab', 'chrome']"></font-awesome-icon>
            {{ tr("extensions") }}
          </a>
        </li>
        <li>
          <a @click="navigate('chrome://settings/clearBrowserData')">
            <font-awesome-icon icon="trash"></font-awesome-icon>
            {{ tr("cleanup") }}
          </a>
        </li>
        <li>
          <a v-on:click="navigate('chrome://settings/cookies')">
            <font-awesome-icon icon="cookie-bite"></font-awesome-icon>
            {{ tr("cookies") }}
          </a>
        </li>
        <li>
          <a v-on:click="navigate('chrome://settings')">
            <font-awesome-icon icon="cogs"></font-awesome-icon>
            {{ tr("params") }}
          </a>
        </li>
        <li>
          <a v-on:click="navigate('chrome://settings/passwords')">
            <font-awesome-icon icon="key"></font-awesome-icon>
            {{ tr("passwords") }}
          </a>
        </li>
        <li>
          <a v-on:click="navigate('chrome://bookmarks')">
            <font-awesome-icon icon="bookmark"></font-awesome-icon>
            {{ tr("all_bookmarks") }}
          </a>
        </li>
        <li>
          <a @click="restart">
            <font-awesome-icon icon="sync-alt"></font-awesome-icon>
            {{ tr("chrome_reload") }}
          </a>
        </li>
      </ul>
    </section>
    <section id="controls-container">
      <a id="settings-trigger" v-on:click="toggleSettings" class="settings-trigger" :title="tr('settings')">
        <font-awesome-icon icon="cogs"></font-awesome-icon>
      </a>

    </section>
    <section id="bookmarks-and-extensions">
      <BookmarksBlock v-bind:settings="settings" :rootNode="settings.sync.bookmarksRootNode"></BookmarksBlock>

      <ExtensionsBlock v-bind:settings="settings"></ExtensionsBlock>
    </section>
  </main>
</template>

<script>
import BookmarksBlock from "@/components/BookmarksBlock";
import ExtensionsBlock from "@/components/ExtensionsBlock";
import Settings from "@/components/settings"

export default {
  name: 'App',
  components: {
    BookmarksBlock,
    ExtensionsBlock
  },
  methods: {
    toggleSettings() {
      this.$data.settingsVisible = !this.$data.settingsVisible
    },
    toggleEdit() {
      this.settings.current.editMode = !this.settings.current.editMode;
    },
    saveSettings() {
      this.settings.saveSyncSettings();
    },
    navigate(targetUrl) {
      this.$chrome.tabs.create({url: targetUrl});
    },
    restart() {
    }
  },
  data: function () {
    return {
      settings: new Settings(
          this.$chrome
      ),
      settingsVisible: false
    };
  }
}
</script>

<style lang="scss">
@import "node_modules/bootstrap/scss/bootstrap.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  height: 100%;
  display: flex;
  flex-direction: row;
  align-content: stretch;
}

#settings-container {
  width: 230px;
  margin-left: -230px;
  background-color: lightgray;
  padding: 3rem 0 3rem 1rem;
  text-align: left;
  overflow-y: auto;
  transition: margin-left 0.5s;
  color: darkslategray;

  h3 {
    color: black;
  }
  label {
    display: block;
  }

  a {
    cursor: pointer;
  }
  a:hover {
    text-decoration: underline;
  }
}

.settings-open {
  margin-left: 0 !important;
}

#bookmarks-and-extensions {
  flex: 1;
  position: relative;
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}

.content {
  margin: 5px 70px;
  padding: 5px;
  z-index: 1;
}

#content-bookmarks, #content-extensions {
  display: flex;
  flex-wrap: wrap;
}

#controls-container {
  width: 48px;
  /*position: relative;*/
  background-color: lightgray;
  overflow-y: auto;
  transition: display 0.5s;
  padding-top: 1rem;

  .edit-mode {
    filter: brightness(50%);
  }
}

.controls-hidden {
  display: none;
}

.controls {
  font-size: 2em;
  color: slategrey;
  /*filter: drop-shadow(5px 4px 3px #888);*/
}

.icon {
  text-align: left;
  background-color: white;
  border-radius: 2px;
  overflow: hidden;
  width: 200px;
  height: 60px;

  /* alignment */
  cursor: pointer;
  color: black;
  justify-content: left;
  border: 1px solid lightgray;

  font-size: 1em;

  &:hover {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.28);
  }

  .icon-name-side {
    overflow: hidden;
    font-family: sans-serif;
  }

  .icon-image-side {
    color: rgb(114, 121, 130);
    font-size: 1.3rem; // this is for fontawesome
  }

  img {
    //height: 50%;
    width: 90%;
  }
}

.items-group {
  header {
    margin: 10px 70px;
    padding: 0;
    color: grey;
    font-weight: bold;
    font-size: 14pt;
  }
}

header {
  h2 {
    padding: 0;
    margin: 0;
  }
}

.settings-trigger {
  cursor: pointer;
  display: block;
  font-size: 1.5rem;
  color: darkslategrey;
}

.trigger, .trigger img {
  width: 32px;
  height: 32px;
}

.trigger:hover, .trigger.active {
  background-color: gray;
}

#chrome-tools-controls {
  width: 32px;

  .trigger {
    float: left;
  }

}

.icon-wrapper {
  border-radius: 2px;
}

.icon-nested-1 {
  background-color: rgba(200, 200, 200, 0.3);
}

.icon-nested-2 {
  background-color: rgba(200, 200, 200, 0.6);
}

.icon-nested-3 {
  background-color: rgba(200, 200, 200, 0.9);
}

.icon-list-position-first, .icon-list-position-middle, .icon-list-position-last {
  border: 1px solid lightgray;
}

.icon-list-position-first {
  border-right: 0;
  border-radius: 2px 0 0 2px;
}

.icon-list-position-middle {
  border-right: 0;
  border-left: 0;
  border-radius: 0;
}

.icon-list-position-last {
  border-left: 0;
  border-radius: 0 2px 2px 0;
}

/*#settings span {*/
/*	font-size: 10pt;*/
/*}*/

/*#settings-holder {*/
/*	width: 32px;*/
/*}*/

.action-list {
  list-style-type: none;
  padding: 0 0 0 0.5rem;
  li {
    margin: 0.3rem 0;
  }
}

</style>
