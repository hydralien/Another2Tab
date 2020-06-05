const SAVINGS_TIMEOUT = 2000;

export default class Settings {
	constructor(chromeInstance, initCallback) {
		this.chrome = chromeInstance;
		this.savingsTimer = null;

		this.current = {
			settingsBlock: {
				marginLeft: 0
			},
		};

		this.sync = {
			icon: {
				width: 64,
				backgroundColor: "#55ffaa"
			},
			// bookmarksRootNode: 0,
			bookmarksRootNode: 1, // this has to be configurable
		};

		this.local = {};

		if (initCallback == null) {
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
		this.saveSettings(this.chrome.storage.local, this.local);
	}

	saveSettings(chromeStorage, settingsObject) {
		if (this.savingsTimer != null) {
			clearTimeout(this.savingsTimer);
		}

		let storageMethod = function () {
			console.log("saving settings...");
			chromeStorage.set(settingsObject, function () {
				console.log("settings saved!");
			});
		};

		this.savingsTimer = setTimeout(storageMethod, SAVINGS_TIMEOUT);
	}

}