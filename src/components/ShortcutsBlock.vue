<template>
  <div>
    <div v-if="iconsOnly">
      <a
        v-for="(shortcut, index) in browserShortcuts"
        :key="index"
        :href="shortcut.url"
        v-on:click.prevent="
          shortcut.click ? shortcut.click() : navigate(shortcut.url)
        "
        :class="secondaryIconsClass"
        :title="tr(shortcut.titleTag)"
      >
        <font-awesome-icon :icon="shortcut.icon"></font-awesome-icon>
      </a>
    </div>
    <div v-else>
      <ul class="action-list">
        <li v-for="(shortcut, index) in browserShortcuts" :key="index">
          <a
            :href="shortcut.url"
            v-on:click.prevent="
              shortcut.click ? shortcut.click() : navigate(shortcut.url)
            "
          >
            <font-awesome-icon :icon="shortcut.icon"></font-awesome-icon>
            {{ tr(shortcut.titleTag) }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { Vue, Component, Prop } from "vue-property-decorator";
import { Browser, browserType, CHROME, FIREFOX, EDGE } from "@/browser";

export default
@Component({})
class ShortcutsBlock extends Vue {
  @Prop({ type: Boolean, required: true })
  iconsOnly;

  @Prop({
    type: Array,
    default: () => {
      return [];
    },
  })
  secondaryIconsClass;

  chromeShortcuts = [
    {
      url: "chrome://extensions/",
      titleTag: "extensions",
      icon: "puzzle-piece",
    },
    {
      url: "chrome://settings/clearBrowserData",
      titleTag: "cleanup",
      icon: "trash",
    },
    {
      url: "chrome://settings/cookies",
      titleTag: "cookies",
      icon: "cookie-bite",
    },
    {
      url: "chrome://settings",
      titleTag: "params",
      icon: "sliders-h",
    },
    {
      url: "chrome://settings/passwords",
      titleTag: "passwords",
      icon: "key",
    },
    {
      url: "chrome://bookmarks",
      titleTag: "all_bookmarks",
      icon: "bookmark",
    },
    {
      url: "chrome://flags",
      titleTag: "flags",
      icon: "flag",
    },
    {
      url: "chrome://restart",
      click: () => this.$emit("reload", "chrome://restart"),
      titleTag: "chrome_reload",
      icon: "sync-alt",
    },
  ];

  firefoxShortcuts = [
    {
      url: "about:addons",
      titleTag: "extensions",
      click: () => this.$emit("reload", "about:addons", "navigation_explanation"),
      icon: "puzzle-piece",
    },
    {
      url: "about:preferences#privacy",
      titleTag: "cleanup",
      icon: "trash",
      click: () => this.$emit("reload", "about:preferences#privacy", "navigation_explanation"),
    },
    {
      url: "about:preferences#privacy",
      titleTag: "cookies",
      click: () => this.$emit("reload", "about:preferences#privacy", "navigation_explanation"),
      icon: "cookie-bite",
    },
    {
      url: "about:preferences",
      titleTag: "params",
      click: () => this.$emit("reload", "about:preferences", "navigation_explanation"),
      icon: "sliders-h",
    },
    {
      url: "about:logins",
      titleTag: "passwords",
      click: () => this.$emit("reload", "about:logins", "navigation_explanation"),
      icon: "key",
    },
    {
      url: "about:config",
      titleTag: "flags",
      icon: "flag",
      click: () => this.$emit("reload", "about:config", "navigation_explanation"),
    },
  ];

  edgeShortcuts = [
    {
      url: "edge://extensions/",
      titleTag: "extensions",
      icon: "puzzle-piece",
    },
    {
      url: "edge://settings/clearBrowserData",
      titleTag: "cleanup",
      icon: "trash",
    },
    {
      url: "edge://settings/content/cookies",
      titleTag: "cookies",
      icon: "cookie-bite",
    },
    {
      url: "edge://settings/",
      titleTag: "params",
      icon: "sliders-h",
    },
    {
      url: "edge://settings/passwords",
      titleTag: "passwords",
      icon: "key",
    },
    {
      url: "edge://favorites/",
      titleTag: "all_bookmarks",
      icon: "bookmark",
    },
    {
      url: "edge://flags",
      titleTag: "flags",
      icon: "flag",
    },
    {
      url: "edge://restart",
      click: () => this.$emit("reload", "edge://restart"),
      titleTag: "chrome_reload",
      icon: "sync-alt",
    },
  ];

  get browserShortcuts() {
    if (browserType() === CHROME) return this.chromeShortcuts;
    if (browserType() === FIREFOX) return this.firefoxShortcuts;
    if (browserType() === EDGE) return this.edgeShortcuts;
    return [];
  }

  navigate(targetUrl) {
    Browser.tabs.create({ url: targetUrl });
  }
}
</script>