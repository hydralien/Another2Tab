<template>
	<main id="app">
		<section id="settings-container" v-bind:style="{ marginLeft: settings.current.settingsBlock.marginLeft + 'px' }">
			<h2>
				{{tr("settings")}}
			</h2>
			<label>
				{Icon size multiplier}:
				<input step="1" type="number" v-model.lazy.number="settings.sync.icon.width">
				<input type="range" min="10" max="256" step="1" v-model.number="settings.sync.icon.width">
			</label>
			<label>
				{Icon background color}:
				<input type="color" v-model="settings.sync.icon.backgroundColor">
			</label>
			<button v-on:click="saveSettings">{Save settings}</button>
		</section>
		<section id="controls-container">
			<section id="settings-controls" class="controls">
				<div id="settings-trigger" class="trigger" v-on:click="toggleSettings">
					<font-awesome-icon icon="sliders-h"></font-awesome-icon>
				</div>
				<div class="trigger" id="edit" v-bind:class="{ 'edit-mode': settings.current.editMode}" v-on:click="toggleEdit">
					<font-awesome-icon icon="pencil-ruler"></font-awesome-icon>
				</div>
			</section>

			<section id="chrome-tools-controls" class="controls">
				<div class="trigger" id="extensions" v-on:click="navigate('chrome://extensions/')">
					<font-awesome-icon :icon="['fab', 'chrome']"></font-awesome-icon>
				</div>
				<div class="trigger" id="cleanup">
					<font-awesome-icon icon="trash"></font-awesome-icon>
				</div>
				<div class="trigger" id="cookies">
					<font-awesome-icon icon="cookie-bite"></font-awesome-icon>
				</div>
				<div class="trigger" id="params">
					<font-awesome-icon icon="cogs"></font-awesome-icon>
				</div>
				<div class="trigger" id="passwords">
					<font-awesome-icon icon="key"></font-awesome-icon>
				</div>
				<div class="trigger" id="all_bookmarks">
					<font-awesome-icon icon="bookmark"></font-awesome-icon>
				</div>
				<a href="chrome://restart/">
					<div class="trigger" id="chrome_reload">
						<font-awesome-icon icon="sync-alt"></font-awesome-icon>
					</div>
				</a>
			</section>
		</section>
		<section id="bookmarks-and-extensions">
			<BookmarksBlock v-bind:bookmarks="iconPot.bookmarkPot" v-bind:settings="settings"></BookmarksBlock>

			<ExtensionsBlock v-bind:extensions="iconPot.extensionPot" v-bind:settings="settings"></ExtensionsBlock>
		</section>
	</main>
</template>

<script>
	import BookmarksBlock from "@/components/BookmarksBlock";
	import ExtensionsBlock from "@/components/ExtensionsBlock";
	import Settings from "@/components/settings"
	import IconPot from "@/components/iconpot";

	export default {
		name: 'App',
		components: {
			BookmarksBlock,
			ExtensionsBlock
		},
		methods: {
			toggleSettings() {
				this.settings.current.settingsBlock.marginLeft = this.settings.current.settingsBlock.marginLeft === 0 ? -250 : 0;
			},
			toggleEdit() {
				this.settings.current.editMode = !this.settings.current.editMode;
			},
			saveSettings() {
				this.settings.saveSyncSettings();
			},
			navigate(targetUrl) {
				this.$chrome.tabs.create({url: targetUrl});
			}
		},
		data: function () {
			return {
				settings: new Settings(
					this.$chrome,
					() => {
						this.iconPot.loadPots(this.settings.sync.bookmarksRootNode.toString())
					}
				),
				iconPot: new IconPot(this.$chrome),
			};
		},
		watch: {
			'settings.sync.bookmarksRootNode': () => {
				this.icons.loadPots(this.settings.sync.bookmarksRootNode)
			},
		}
	}
</script>

<style lang="less">
	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;

		height: 100%;
		display: flex;
		flex-direction: row;
		align-content: stretch;
	}

	#settings-container {
		width: 230px;
		/*margin-left: -250px;*/
		background-color: #4285f4;
		color: white;
		padding: 10px;
		overflow-y: auto;

		label {
			display: block;

		}
	}

	#bookmarks-and-extensions {
		flex: 1;
		position: relative;
		width: 100%;
		height: 100vh;
		overflow-y: auto;
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
	}

	.content {
		margin: 5px 70px;
		padding: 5px;
		z-index: 1;
	}

	#content-bookmarks, #content-extensions {
		display: flex;
		flex-wrap: wrap;
	}

	#controls-container {
		width: 64px;
		/*position: relative;*/
		background-color: #DDDEE2;
		overflow-y: auto;

		.edit-mode {
			filter: brightness(50%);
		}
	}

	.controls {
		font-size: 2em;
		color: #4285f4;
		/*filter: drop-shadow(5px 4px 3px #888);*/
	}

	.icon {
		text-align: center;
		background-color: #DDDEE2;
		border-radius: 5px;
		padding: 10px;
		margin: 10px;
		overflow: hidden;

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

	.items-group {
		header {
			margin: 10px 70px;
			padding: 0;
			color: grey;
			font-weight: bold;
			font-size: 14pt;
		}
	}

	header {
		h2 {
			padding: 0;
			margin: 0;
		}
	}

	.trigger {
		cursor: pointer;
		padding: 15px;
		z-index: 2;
		border: 1px solid transparent;
	}

	.trigger, .trigger img {
		width: 32px;
		height: 32px;
	}

	.trigger:hover, .trigger.active {
		background-color: #bebebe;
	}

	#chrome-tools-controls {
		width: 32px;

		.trigger {
			float: left;
		}

	}


	/*#settings span {*/
	/*	font-size: 10pt;*/
	/*}*/

	/*#settings-holder {*/
	/*	width: 32px;*/
	/*}*/

</style>
