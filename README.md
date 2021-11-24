# README #

It's a Google Chrome extension that uses new tab page to display selected bookmarks and extensions for a quick and easy access

### What is this repository for? ###

A Google Chrome plugin that uses New Tab page to show bookmarks folder (Bookmarks Bar by default) for quick access to its items and allows to manage it
This extension replaces standard New Tab page with a very simple thing - a list of a content of a selected bookmarks folder (Bookmarks Bar by default) and some useful Chrome shortcuts, like settings, passwords, cookies, extensions and data cleanup. It also syncs with Google (if you have Chrome logged into your Google account) so you have settings synchronized across all computers you use Chrome at.
Some limited bookmark and extension management functions are also available/ 

### How do I get set up? ###
* You need Node.js installed to build the package - follow https://nodejs.org/en/download/ instructions to get one
* Then, in the cloned AnotherTab repository, run `yarn install` to retrieve all the packages required for building the app; might take some time.
* Once done, run `yarn run build` if you only want to build it once (meaning you're not going to change code)
    * In this case, use `dist/` directory content add the package as 'unpacked' extension to Chrome (the actual code of extension will be built to the `dist`)
    
* If you want to develop teh code, run `yarn run dev` - it will monitor for changes and re-build the extension each time you change it
    * In this case, use `build/` directory content add the package as 'unpacked' extension to Chrome (the actual code of extension will be built to the `build`)

* Follow the official Chrome Developer guide to install a built extension as 'unpacked'': https://developer.chrome.com/extensions/getstarted#unpacked
* Package update: install npm-check-updates with `npm install -g npm-check-updates`, then do `ncu -u` and then `yarn install`

### More info
* Extension "website" is at http://hydralien.net/anothertab/
* Extension page on Chrome Webstore: https://chrome.google.com/webstore/detail/anothertab-new-tab-page/cpeojfdfhhgedcaiglbjdklaigennhpl