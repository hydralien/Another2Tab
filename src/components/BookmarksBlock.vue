<template>
    <div class="BookmarksBlock">
        <div v-for="(bookmark,id) in bookmarks" v-bind:key="id">
            <Bookmark v-bind:bookmark="bookmark"></Bookmark>
        </div>
    </div>
</template>

<script>
    import Bookmark from "@/components/Bookmark";

    export default {
        components: {Bookmark},
        props: {
            rootNodeId: String
        },
        data: function () {
            return {
                bookmarks: []
            }
        },
        methods: {
            bookmarksReceived(newBookmarks) {
                this.bookmarks = newBookmarks;
            }
        },
        mounted() {
            this.$chrome.bookmarks.getChildren(this.rootNodeId, this.bookmarksReceived);
        }
    };
</script>
