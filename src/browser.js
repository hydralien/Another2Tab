export const FIREFOX = 'firefox'
export const CHROME = 'chrome'
export const EDGE = 'edge'
export const OTHER_BROWSER = ''

export function browserType() {
	const navigatorObject = window.navigator
	if (navigatorObject.userAgent.indexOf('Firefox') > -1) {
		return FIREFOX
	}
	if (navigatorObject.userAgent.indexOf('Chrome') > -1) {
		return CHROME
	}
	if (navigatorObject.userAgent.indexOf('Edge') > -1) {
		return EDGE
	}
	return OTHER_BROWSER
}

export function getBrowserObject() {
	if (browserType() === FIREFOX) return browser;
	if (browserType() === CHROME) return chrome;
	if (browserType() === EDGE) return chrome;
	return {}
}

export const Browser = new Proxy({}, {
	get(target, name, receiver) {
		const browserObject = getBrowserObject()
		if (!Reflect.has(browserObject, name)) {
			console.log("Getting non-existent property '" + name + "'");
			return undefined;
		}
		return Reflect.get(browserObject, name, receiver);
	}
})

export default Browser