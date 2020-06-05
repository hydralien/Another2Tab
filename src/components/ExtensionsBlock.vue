<template>
    <article id="extensions" class="items-group">
        <h2>
            {Extensions}
        </h2>
        <section class="content" id="content-extensions">
            <button v-on:click="openExtensions">Extensions</button>
        </section>
    </article>
</template>

<script>
    export default {
        props: {
        },
        methods: {
            openExtensions() {
                this.$chrome.tabs.create({url: 'chrome://extensions/'});
            },
        }
    };
</script>
