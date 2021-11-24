<template>
  <article id="extensions" class="items-group">
    <Modal :visible.sync="extensionEditVisible" @close="extensionEditVisible = false">
      <template slot="header">{{ tr("edit_extension") }}</template>
      <div class="form-group text-left bookmark-edit">
        <h6>{{tr("icon")}}</h6>
        <input id="icon-selector" class="mr-1" type="radio" :value="extensionToEdit.id" v-model="extensionToEdit.id">
        <label for="icon-selector" class="form-check-label">
          <img :src="'chrome://extension-icon/' + extensionToEdit.id + '/48/1'" alt="Icon image"/>
        </label>
        <h6>{{tr("title")}}</h6>
        <p>{{extensionToEdit.name}}</p>
        <h6>{{tr("type")}}</h6>
        <p class="badge badge-info">{{extensionToEdit.type}}</p>
      </div>
      <template slot="footer">
        <button class="btn btn-outline-primary" @click="extensionEditVisible = false">{{tr("close")}}</button>
        <button class="btn btn-danger" @click="deleteExtension" :disabled="processSaving">{{tr("delete")}}</button>
      </template>
    </Modal>
    <h2>
      {{ tr("extensions_header") }}
    </h2>
    <section class="content tiles" id="content-extensions">
      <Extension v-for="(extension,id) in extensions" v-bind:key="id" v-bind:extension="extension"
                 :edit-mode="editMode" v-bind:settings="settings" @edit="editExtension"></Extension>
    </section>
  </article>
</template>

<script>
import Extension from "@/components/Extension";
import {Vue, Prop, Component} from 'vue-property-decorator'
import Modal from "@/components/Modal";
import Browser from "@/browser";

export default @Component({
  components: {
    Extension,
    Modal
  }
})
class ExtensionsBlock extends Vue {
  @Prop({type: Object, required: true})
  settings

  @Prop({type: Boolean, default: false})
  editMode

  extensions = []

  extensionEditVisible = false

  extensionToEdit = {}

  processSaving = false

  mounted() {
    this.loadExtensions()
  }

  loadExtensions() {
    Browser.management.getAll(
        (loadedExtensions) => {
          if (loadedExtensions === null || !Array.isArray(loadedExtensions) || loadedExtensions.length === 0) {
            this.extensions = [];
            return;
          }
          loadedExtensions = loadedExtensions.filter((loadedExtension) => !loadedExtension.type || loadedExtension.type !== 'theme')
          this.extensions = loadedExtensions;
        }
    );
  }

  editExtension(extension) {
    this.extensionToEdit = extension
    this.extensionEditVisible = true
  }

  deleteExtension() {
    this.processSaving = true
    Browser.management.uninstall(
        this.extensionToEdit.id,
        {showConfirmDialog: true},
        () => {
          this.loadExtensions()
          this.extensionEditVisible = false
        }
    )
  }
}
</script>
