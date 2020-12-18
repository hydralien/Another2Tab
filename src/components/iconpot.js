export default class IconPot {
	constructor(chromeInstance) {
		this.chrome = chromeInstance;

		this.bookmarkPot = [];
		this.extensionPot = [];
	}

	loadPots() {
		this.chrome.management.getAll(
			extensions => {
				this.extensionPot = extensions;
			}
		);
	}
}