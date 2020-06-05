export default class IconPot {
	constructor(chromeInstance) {
		this.chrome = chromeInstance;

		this.bookmarkPot = [];
		this.extensionPot = [];
	}

	loadPots(bookmarksRootNode) {
		this.chrome.bookmarks.getChildren(
			bookmarksRootNode,
			bookmarks => {
				this.bookmarkPot = bookmarks;
			}
		);
	}
}