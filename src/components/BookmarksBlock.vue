<template>
	<article id="bookmarks" class="items-group">
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
		},
		data: function () {
			return {
				// bookmarks: []
			}
		},
		methods: {
			// bookmarksReceived(newBookmarks) {
			// 	this.bookmarks = newBookmarks;
			// }
		},
		watch: {
			// rootNodeId: () => {
			// 	this.$chrome.bookmarks.getChildren(this.rootNodeId, this.bookmarksReceived);
			// }
		},
		mounted() {

		}
	};
</script>

<style lang="less">
	.icon {
		text-align: center;
		background-color: #DDDEE2;
		border-radius: 5px;
		padding: 10px;
		margin: 10px;
		overflow: hidden;
		min-width: calc(var(--icon-min-width) * var(--icon-size-multiplier));
		max-width: calc(var(--icon-max-width) * var(--icon-size-multiplier));
		min-height: calc(var(--icon-min-height) * var(--icon-size-multiplier));
		max-height: calc(var(--icon-max-height) * var(--icon-size-multiplier));

		/* alignment */
		cursor: pointer;
		color: blue;
		justify-content: center;
		border: 1px solid transparent;

		font-size: 3em;

		p {
			margin: 0;
			font-size: 50%;
		}
		img {
			width: 50%;
		}
	}
</style>