<template>
    <article id="extensions" class="items-group">
        <h2>
            {Extensions}
        </h2>
        <section class="content" id="content-extensions">
            <Extension v-for="(extension,id) in extensions" v-bind:key="id" v-bind:extension="extension" v-bind:settings="settings"></Extension>
        </section>
    </article>
</template>

<script>
    import Extension from "@/components/Extension";
    import {Vue, Prop, Component} from 'vue-property-decorator'

    export default
    @Component({
      components: {
        Extension
      }
    })
    class ExtensionsBlock extends Vue {
      @Prop({type: Object, required: true})
      settings

      extensions = []

      mounted () {
        this.$chrome.management.getAll(
            (loadedExtensions) => {
              this.extensions = loadedExtensions;
            }
        );
      }
    }
</script>
