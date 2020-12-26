<template>
  <article id="bookmarks" class="items-group mt-3">
    <Modal :visible.sync="bookmarkEditVisible" @close="bookmarkEditVisible = false">
      <template slot="header">{{ tr("edit_bookmark") }}</template>
      <div class="form-group text-left">
        <h6>Icon</h6>
        <input id="icon-selector" class="form-check-input" type="radio" :value="bookmarkToEdit.url" v-model="bookmarkToEdit.url">
        <label for="icon-selector" class="form-check-label">
          <img :src="settings.getCachedLocalIcon(bookmarkToEdit.url)" alt="Icon image"/>
        </label>
        <h6><label for="bookmark-name-edit">Title</label></h6>
        <input id="bookmark-name-edit" type="text" class="form-control" v-model="bookmarkToEdit.title">
        <h6><label for="bookmark-url-edit">Link</label></h6>
        <input id="bookmark-url-edit" type="text" class="form-control" v-model="bookmarkToEdit.url">
      </div>
      <template slot="footer">
        <button class="btn btn-outline-primary" @click="bookmarkEditVisible = false">{Close}</button>
        <button class="btn btn-primary" @click="saveBookmarkEdit">{Save}</button>
      </template>
    </Modal>
    <section id="bookmarks-root-selection" v-if="settings.current.editMode">
      <h2>
        {{tr("bookmarks_root_header")}}
      </h2>
      <section class="content" id="content-bookmarks-root-selection">

      </section>
    </section>
    <h2>
      {{tr("bookmarks_header")}}
    </h2>
    <section class="content" id="content-bookmarks">
      <Bookmark v-for="(bookmark,index) in bookmarks" v-bind:key="index" v-bind:bookmark="bookmark"
                v-bind:settings="settings" :edit-mode="editMode" :index="index"
                @edit="editBookmark" @directoryToggle="toggleBookmark"></Bookmark>
    </section>
  </article>
</template>

<script>
import Bookmark from "@/components/Bookmark";
import Modal from "@/components/Modal";
import {Vue, Prop, Watch, Component} from 'vue-property-decorator'

export default @Component({
  components: {
    Bookmark,
    Modal
  }
})
class BookmarksBlock extends Vue {
  @Prop({type: Object, required: true})
  settings;

  @Prop({type: [String, Number], required: true})
  rootNode;

  @Prop({type: Boolean, default: false})
  editMode

  bookmarkEditVisible = false

  bookmarkToEdit = {}

  @Watch('rootNode')
  rootNodeChange(newRootNode) {
    this.loadBookmarks(newRootNode)
  }

  mounted() {
    this.loadBookmarks(this.rootNode)
  }

  bookmarks = [];

  editBookmark(bookmark) {
    this.bookmarkToEdit = bookmark
    this.bookmarkEditVisible = true
  }

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

  saveBookmarkEdit() {
    this.bookmarkEditVisible = false
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