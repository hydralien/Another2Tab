import Vue from 'vue'
import {shallowMount} from '@vue/test-utils'

import Bookmark from "../../src/components/Bookmark.vue";
import Settings from "../../src/components/settings.js";

function mockChrome() {
	return {
		storage: {
			local: {
				get: function (defaults, callback) {
					return callback(defaults);
				}
			},
			sync: {
				get: function (defaults, callback) {
					return callback(defaults);
				}
			}
		}
	}
}

function getMount() {
	return shallowMount(
		Bookmark,
		{
			bookmarks: [
				{
					id: 1,
					url: "mockery",
					title: "Mock Icon"
				}
			],
			settings: new Settings(mockChrome())
		}
	);
}

describe('Bookmark.vue', () => {
	it('has properly generated icon url', async () => {
		const wrapper = getMount();
		expect(wrapper.find('img').src).toMatch("chrome://favicon/mockery");
		expect(wrapper.find('p').text()).toMatch("Mock Icon");
	})
});
