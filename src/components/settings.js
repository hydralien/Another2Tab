import {Browser,browserType,FIREFOX,EDGE} from "@/browser";

const SAVINGS_TIMEOUT = 1000;

export default class Settings {
	ICON_CACHE_ITEM_TTL_SECONDS = 3600 * 24 * 7;

	EMPTY_GOOGLE_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAqpJREFUOE9jZKAQMML0h4au4nz567WItYmS6e9ff7Lff/hu8vHTDx6QPB8vxxdBAc4zbOwsU4+euXdanE30zerVYd9BcmADQJq//H4vpaImnvrl608/FUVhMTklIeFfv/8ysLEyMyjKCTPs3n3j7YNH71/x8bJtunPr9WweVsFnIEPABtj5T5XVV5fO/vb9T5SWjpisorwwAzcXG4ORrgzD12+/GOSl+Biev/7GcPnGM4Zly88+5uNmW3bx9vOphzZmPwYbUNm8PejZ848tqUmWmq/efAH7ipWVGUzrakiCDfj7j4Hh0Kn7YCfPX3TyurSUQE17rec6sAHFNZv38nCz6deWuQlv2n0NJVidbdQY+LhZGD59/cOw98gtBiU5IYY16y6+/fr918X+Vj9nsAFJOas+JiWY8+lqSIEVwQBMM4gPcsHNe28Ybt59xSAmwsMwZ96JTwumhfODDQiOW/i3o8mPSUVegGHX4TsMMpICYAyyGRnsP3Gf4cPH7wwgi8prNv5btySBGW7A5J4QJklRLrBTT5x7AA5AEQEODANAgaqhLM5QVrPx33qYAYnZKz8mJ1rwWRvLwTUcPfsIzlaSE2EAGQ4Cbz78AHtj9tzjnxZOj4B4ARaIDRVuwjBdsECD8aUlBRjM9KTA3IqG7W9//fpzsb8dGogVjdsDn7/42JqabKkJcwW6ASCNfq5aDCfOP2KYOefYdWlJgeqOes/1SAlJMvvTl19RqUmWsjBD7jz8AE48kPQgxfDyzSeGmbOPPRbgZUdNSIikLJr68fNPPxlJfjEvL23h37//Mtx79Jbh16+/DI/vv3/7+NmHVwI87Jvu3EFLyrD8AMpMVkZKJj9//c55//67yafPP3j+//8PzkzCQlynuThYppw6c/8sP3pmQokrEjkAXks6IN8w3ycAAAAASUVORK5CYII=";

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

		// Firefox doesn't provide favicon cache access
		if (cachedIcon.content === this.EMPTY_GOOGLE_IMAGE && browserType() !== FIREFOX) {
			return this.getFallbackIcon(iconUrl);
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