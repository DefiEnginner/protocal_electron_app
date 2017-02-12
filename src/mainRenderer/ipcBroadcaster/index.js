const { ipcRenderer } = require('electron');

export default {
	ipcShowChildWin(visible) {
		ipcRenderer.send('showChildWin', visible);
	},
	ipcSendClickedLink(href) {
		ipcRenderer.send('sendClickedLink', href);
	}
}