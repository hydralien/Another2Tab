// Check for specs:
// 	https://vue-test-utils.vuejs.org/api/wrapper/
//  https://vuejs.org/v2/guide/unit-testing.html
// Check article:
// https://testdriven.io/blog/vue-unit-testing/
// and code: https://gitlab.com/patkennedy79/vue-weather-app

import {shallowMount} from '@vue/test-utils';

import Bookmark from "@/components/Bookmark.vue";
import Settings from "@/components/settings.js";

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
			propsData: {
				bookmark: {
					id: 1,
					url: "mockery",
					title: "Mock Icon"
				},
				settings: new Settings(mockChrome())
			}
		}
	);
}

describe('Bookmark.vue', () => {
	it('has properly generated icon url', async () => {
		const wrapper = getMount();
		console.log(wrapper.find('img').src);
		expect(wrapper.find('img').attributes('src')).toMatch("chrome://favicon/mockery");
		expect(wrapper.find('p').text()).toMatch("Mock Icon");
	})
});
