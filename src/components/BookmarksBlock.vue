<template>
  <article id="bookmarks" class="items-group">
    <section id="bookmarks-root-selection" v-if="settings.current.editMode">
      <h2>
        {Bookmarks Root}
      </h2>
      <section class="content" id="content-bookmarks-root-selection">

      </section>
    </section>
    <h2>
      {Bookmarks}
    </h2>
    <section class="content" id="content-bookmarks">
      <Bookmark v-for="(bookmark,index) in bookmarks" v-bind:key="index" v-bind:bookmark="bookmark"
                v-bind:settings="settings" :index="index" @directoryToggle="toggleBookmark"></Bookmark>
    </section>
  </article>
</template>

<script>
import Bookmark from "@/components/Bookmark";
import {Vue, Prop, Watch, Component} from 'vue-property-decorator'

export default @Component({
  components: {
    Bookmark
  }
})
class BookmarksBlock extends Vue {
  @Prop({type: Object, required: true})
  settings;

  @Prop({type: [String, Number], required: true})
  rootNode;

  @Watch('rootNode')
  rootNodeChange(newRootNode) {
    this.loadBookmarks(newRootNode)
  }

  mounted() {
    this.loadBookmarks(this.rootNode)
  }

  bookmarks = [];

  toggleBookmark(bookmarkIndex) {
    const currentBookmark = {}
    Object.assign(currentBookmark, this.bookmarks[bookmarkIndex])
    console.log(currentBookmark)
    if (currentBookmark.opened) {
      currentBookmark.opened = false
      currentBookmark.nestedLevel = currentBookmark.nestedLevel - 1
      currentBookmark.listPosition = currentBookmark.prevListPosition || ""
      currentBookmark.prevListPosition = ""

      const childCount = this.bookmarks.filter((bookmark) => bookmark.parentId === currentBookmark.id).length

      this.bookmarks.splice(bookmarkIndex, childCount + 1, currentBookmark)
      return
    }

    currentBookmark.opened = true
    if (currentBookmark.listPosition) currentBookmark.prevListPosition = currentBookmark.listPosition
    currentBookmark.listPosition = "first"
    currentBookmark.nestedLevel = (currentBookmark.nestedLevel || 0) + 1
    if (currentBookmark.nestedLevel > 3) currentBookmark.nestedLevel = 3 // no deep nesting for coloring reasons

    this.bookmarks.splice(bookmarkIndex, 1, currentBookmark)
    // this.$set(this.bookmarks, bookmarkIndex, currentBookmark)
    this.loadBookmarks(currentBookmark.id, bookmarkIndex + 1, currentBookmark)
  }

  loadBookmarks(rootNode, insertAt, parentBookmark) {
    if (!insertAt) insertAt = 0
    console.log("Loading ", rootNode, insertAt)
    this.$chrome.bookmarks.getChildren(
        rootNode.toString(),
        (loadedBookmarks) => {
          if (!loadedBookmarks || loadedBookmarks.length === 0) {
            return
          }
          if (parentBookmark && parentBookmark.opened) {
            loadedBookmarks = loadedBookmarks.map(
                (bookmark) => {
                  bookmark.nestedLevel = parentBookmark.nestedLevel
                  bookmark.listPosition = "middle"
                  return bookmark
                }
            )
            loadedBookmarks[loadedBookmarks.length - 1].listPosition = "last"
          }
          this.bookmarks.splice(insertAt, 0, ...loadedBookmarks);
        }
    );
  }
}
</script>

<style lang="less">
.bookmark-item {

}
</style>