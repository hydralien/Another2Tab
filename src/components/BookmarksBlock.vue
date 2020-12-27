<template>
  <article id="bookmarks" class="items-group mt-3">
    <Modal :visible.sync="bookmarkEditVisible" @close="bookmarkEditVisible = false">
      <template slot="header">{{ tr("edit_bookmark") }}</template>
      <div class="form-group text-left bookmark-edit">
        <form v-on:submit.prevent="saveBookmarkEdit">
          <h6>{{ tr("icon") }}</h6>
          <input id="icon-selector" class="mr-1" type="radio" :value="bookmarkToEdit.url" v-model="bookmarkToEdit.url">
          <label for="icon-selector" class="form-check-label">
            <font-awesome-icon v-if="isEditFolder" :icon="['far', 'folder']" class="directory"></font-awesome-icon>
            <img v-else :src="settings.getCachedLocalIcon(bookmarkToEdit.url)" alt="Icon image"/>
          </label>
          <h6><label for="bookmark-name-edit">{{ tr("title") }}</label></h6>
          <input id="bookmark-name-edit" type="text" class="form-control" v-model="bookmarkToEdit.title">
          <h6><label for="bookmark-url-edit">{{ tr("link") }}</label></h6>
          <input id="bookmark-url-edit" type="text" class="form-control" v-model="bookmarkToEdit.url"
                 :disabled="isEditFolder"
                 :placeholder="isEditFolder ? `(${tr('directory')})` : ''"
          >
          <button type="submit" style="display: none"></button>
        </form>
      </div>
      <template slot="footer">
        <p v-if="confirmDelete" class="text-danger">
          {{ tr("delete_message") }}
        </p>
        <button class="btn btn-outline-primary" @click="bookmarkEditVisible = false">{{ tr("close") }}</button>
        <button class="btn btn-danger" @click="deleteBookmark" :disabled="processSaving">
          {{ confirmDelete ? tr("confirm_delete") : tr("delete") }}
        </button>
        <button type="submit" class="btn btn-primary" :disabled="processSaving" @click="saveBookmarkEdit">
          {{ tr("save") }}
        </button>
      </template>
    </Modal>
    <section id="bookmarks-root-selection" v-if="this.editMode">
      <h2>
        {{ tr("bookmarks_root_header") }}
      </h2>
      <p>
        {{tr("root_select_message")}}
      </p>
      <section class="content tiles" id="content-bookmarks-root-selection">
        <Bookmark v-for="(bookmark,index) in rootMarks" v-bind:key="index" v-bind:bookmark="bookmark"
                  v-bind:settings="settings" :edit-mode="editMode" :index="index"
                  @directoryToggle="toggleBookmark" @root="rootSelection"></Bookmark>
      </section>

    </section>
    <h2>
      {{ tr("bookmarks_header") }}
    </h2>
    <draggable v-model="bookmarks" :move="dragMove" @change="dragEnd" class="content tiles" id="content-bookmarks">
      <Bookmark v-for="(bookmark,index) in bookmarks" v-bind:key="index" v-bind:bookmark="bookmark"
                v-bind:settings="settings" :edit-mode="editMode" :index="index"
                @edit="editBookmark" @directoryToggle="toggleBookmark"></Bookmark>
    </draggable>
  </article>
</template>

<script>
import Bookmark from "@/components/Bookmark";
import Modal from "@/components/Modal";
import {Vue, Prop, Watch, Component} from 'vue-property-decorator'
import draggable from 'vuedraggable'

export default @Component({
  components: {
    Bookmark,
    Modal,
    draggable
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

  confirmDelete = false

  processSaving = false

  bookmarks = [];

  rootMarks = []

  @Watch('bookmarkEditVisible')
  bookmarkEditVisibleChange(value) {
    if (value) this.confirmDelete = false
  }

  @Watch('rootNode')
  rootNodeChange(newRootNode) {
    this.loadBookmarks(newRootNode)
  }

  @Watch('editMode')
  editModeChange(value) {
    if (!value) return
    this.$chrome.bookmarks.getChildren(
        '0',
        (loadedBookmarks) => {
          this.rootMarks = loadedBookmarks.filter((bookmark) => !bookmark.url)
        }
    )
  }

  mounted() {
    this.loadBookmarks(this.rootNode)
  }

  get isEditFolder() {
    return this.bookmarkToEdit.url === undefined;
  }

  dragMove() {
    return this.editMode
  }

  dragEnd(moveParams) {
    const newIndex = moveParams.moved.newIndex
    const updateParams = {}
    const styleParams = {
      listPosition: undefined,
      nestedLevel: undefined
    }
    const previousItem = newIndex > 0 ? this.bookmarks[newIndex - 1] : undefined
    if (previousItem.nestedLevel) {
      styleParams.nestedLevel = previousItem.nestedLevel
      if (previousItem.listPosition === 'first') {
        updateParams.parentId = previousItem.id
        styleParams.listPosition = 'middle'
        updateParams.index = 0
      } else if (previousItem.listPosition === 'last') {
        updateParams.parentId = previousItem.parentId
        styleParams.listPosition = 'last'
        updateParams.index = previousItem.index + 1
        previousItem.listPosition = 'middle'
      } else {
        styleParams.listPosition = 'middle'
        updateParams.index = previousItem.index + 1
        updateParams.parentId = previousItem.parentId
      }
    } else if (previousItem) {
      updateParams.parentId = previousItem.parentId
      updateParams.index = previousItem.index + 1
    } else {
      updateParams.index = 0
      updateParams.parentId = this.rootNode
    }

    Object.assign(this.bookmarks[newIndex], styleParams)
    Object.assign(this.bookmarks[newIndex], updateParams)
    this.$chrome.bookmarks.move(
        this.bookmarks[newIndex].id,
        updateParams,
        () => {}
    )
  }

  rootSelection(rootNode) {
    console.log(rootNode)
  }

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

  deleteBookmark() {
    if (!this.confirmDelete) {
      this.confirmDelete = true
      return
    }
    const callback = () => {
      this.bookmarks.splice(
          this.bookmarks.findIndex((bookmark) => bookmark.id === this.bookmarkToEdit.id),
          1
      )
      this.processSaving = false
      this.confirmDelete = false
      this.bookmarkEditVisible = false
    }
    this.processSaving = true
    if (this.bookmarkToEdit.url === undefined) {
      // directory
      this.$chrome.bookmarks.removeTree(this.bookmarkToEdit.id, callback)
    } else {
      this.$chrome.bookmarks.remove(this.bookmarkToEdit.id, callback)
    }
  }

  saveBookmarkEdit() {
    const updateObject = {
      url: this.bookmarkToEdit.url,
      title: this.bookmarkToEdit.title
    }
    this.$chrome.bookmarks.update(
        this.bookmarkToEdit.id,
        updateObject,
        () => {
          this.processSaving = false
          this.bookmarkEditVisible = false
          Object.assign(
              this.bookmarks.find((bookmark) => bookmark.id === this.bookmarkToEdit.id),
              updateObject
          )
        }
    )
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

<style lang="less" scoped>
.bookmark-edit {
  padding: 0 1em;

  h6 {
    margin: 1em 0 0;
  }
}
</style>