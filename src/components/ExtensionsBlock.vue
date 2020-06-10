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
    export default {
        components: {Extension},
        props: {
            extensions: Array,
            settings: Object
        }
    };
</script>
