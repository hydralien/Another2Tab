<template>
    <div class="Bookmark">
        <pre v-text="bookmark.title"/>
    </div>
</template>

<script>
    export default {
        props: {
            bookmark: Object
        },
    };
</script>
