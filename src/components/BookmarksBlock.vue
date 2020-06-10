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
			<Bookmark v-for="(bookmark,id) in bookmarks" v-bind:key="id" v-bind:bookmark="bookmark" v-bind:settings="settings"></Bookmark>
		</section>
	</article>
</template>

<script>
	import Bookmark from "@/components/Bookmark";

	export default {
		components: {Bookmark},
		props: {
			rootNodeId: String,
			bookmarks: Array,
			settings: Object
		}
	};
</script>

<style lang="less">

</style>