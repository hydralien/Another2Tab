const SAVINGS_TIMEOUT = 1000;
const ICON_CACHE_ITEM_TTL_SECONDS = 3600 * 24 * 7; // one week

export default class Settings {
	constructor(chromeInstance, initCallback) {
		this.chrome = chromeInstance;
		this.savingsTimer = null;

		this.current = {
			settingsBlock: {
				marginLeft: 0
			},
			editMode: false
		};

		this.sync = {
			icon: {
				width: 64,
				backgroundColor: "#55ffaa"
			},
			// bookmarksRootNode: 0,
			bookmarksRootNode: 1, // this has to be configurable
		};

		this.local = {
			// each record in cache supposed to be an object with "content" and "createdAt" fields
			iconCache: {},
			backgroundImage: {
				content: "",
				url: ""
			}
		};

		if (!initCallback) {
			initCallback = function () {
				// nada
			}
		}

		// initCallback();
		this.loadSettings(initCallback);
	}

	loadSettings(initCallback) {
		this.chrome.storage.sync.get(
			//[Object.keys(this.sync)],
			this.sync,
			storedSyncSettings => {
				this.sync = {...this.sync, ...storedSyncSettings};
				initCallback();

				// this needs to be made concurrent with sync load, at some point
				this.chrome.storage.local.get(
					this.local,
					storedLocalSettings => {
						this.local = {...this.local, ...storedLocalSettings};
					}
				);
			}
		)
	}

	saveSyncSettings() {
		this.saveSettings(this.chrome.storage.sync, this.sync);
	}

	saveLocalSettings() {
		this.saveSettings(this.chrome.storage.local, this.local, 100);
	}

	saveSettings(chromeStorage, settingsObject, timeout = SAVINGS_TIMEOUT) {
		if (this.savingsTimer != null) {
			clearTimeout(this.savingsTimer);
		}

		let storageMethod = function () {
			console.log("saving settings...");
			chromeStorage.set(settingsObject, function () {
				console.log("settings saved!");
			});
		};

		this.savingsTimer = setTimeout(storageMethod, timeout);
	}

	getCachedLocalIcon(iconUrl) {
		let cachedIcon = this.local.iconCache[iconUrl];
		if (cachedIcon == null) {return}
		let now = new Date();
		if (parseInt(cachedIcon.createdAt) + ICON_CACHE_ITEM_TTL_SECONDS < parseInt(now.getTime() / 1000)) {
			return;
		}

		return cachedIcon.content;
	}

	saveCachedLocalIcon(iconUrl, iconContent) {
		this.local.iconCache[iconUrl] = {
			content: iconContent,
			createdAt: parseInt(new Date().getTime() / 1000)
		};
		this.saveLocalSettings();
	}

}