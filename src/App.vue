<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">

    <BookmarksBlock root-node-id="0"></BookmarksBlock>

    <button v-on:click="openExtensions">Extensions</button>

  </div>
</template>

<script>
import BookmarksBlock from "@/components/BookmarksBlock";

export default {
  name: 'App',
  components: {
    BookmarksBlock
  },
  methods: {
    openExtensions() {
      this.$chrome.tabs.create({url:'chrome://extensions/'});
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
