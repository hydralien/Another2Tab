import {Browser,browserType,FIREFOX,EDGE} from "@/browser";

const SAVINGS_TIMEOUT = 1000;

export default class Settings {
	ICON_CACHE_ITEM_TTL_SECONDS = 3600 * 24 * 7;

	constructor(initCallback) {
		this.savingsTimer = null;

		this.current = {
			settingsBlock: {
				marginLeft: 0
			},
			iconReload: false
		};

		this.sync = {
			tileSize: 'size-medium',
			backgroundColor: '#ffffff',
			backgroundImageUrl: '',
			highlightedIcons: {},
			// bookmarksRootNode: 0,
			bookmarksRootNode: browserType() !== FIREFOX ? '1' : 'toolbar_____',
			useGoogleIconService: true,
			displaySidebarShortcuts: true
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

		initCallback();
		this.loadSettings(initCallback);
	}

	loadSettings(initCallback) {
		Browser.storage.sync.get(
			//[Object.keys(this.sync)],
			this.sync,
			(storedSyncSettings) => {
				Object.assign(this.sync, storedSyncSettings);
				initCallback();
				this.syncSettingsLoaded()

				// this needs to be made concurrent with sync load, at some point
				Browser.storage.local.get(
					this.local,
					storedLocalSettings => {
						Object.assign(this.local, storedLocalSettings);
					}
				);
			}
		)
	}

	syncSettingsLoaded() {
		if (this.sync.useGoogleIconService) {
			// longer TTL for Google icons as reloading them might not work (e.g. if no internet connection)
			this.ICON_CACHE_ITEM_TTL_SECONDS = 3600 * 24 * 30;
		}
	}

	saveSyncSettings(timeout) {
		if (!timeout) timeout = SAVINGS_TIMEOUT
		this.saveSettings(Browser.storage.sync, this.sync, timeout);
	}

	saveLocalSettings() {
		this.saveSettings(Browser.storage.local, this.local, 100);
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

	getFallbackIcon(iconUrl) {
		return "chrome://favicon/" + iconUrl;
	}

	getCachedLocalIcon(iconUrl) {
		let cachedIcon = this.local.iconCache[iconUrl];

		let now = new Date();
		if (!cachedIcon
			|| this.current.iconReload
			|| parseInt(cachedIcon.createdAt) + this.ICON_CACHE_ITEM_TTL_SECONDS < Math.floor(now.getTime() / 1000)) {
			if (this.sync.useGoogleIconService) {
				return `https://www.google.com/s2/favicons?sz=32&domain_url=${iconUrl}`
			}
			let browserTypeName = 'chrome';
			if (browserType() === EDGE) {
				browserTypeName = 'edge';
			}
			return `${browserTypeName}://favicon/${iconUrl}`;
		}

		return cachedIcon.content;
	}

	saveCachedLocalIcon(iconUrl, iconContent) {
		this.local.iconCache[iconUrl] = {
			content: iconContent,
			createdAt: Math.floor(new Date().getTime() / 1000)
		};
		this.saveLocalSettings();
	}

}