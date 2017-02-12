export const logToRenderer = (s, targetWindow) => {
	console.log(s)
	if (targetWindow && targetWindow.webContents) {
		targetWindow.webContents.executeJavaScript(`console.log("${s}")`)
	}
}

export const stripCustomProtocol = (url, PROTOCOL) => {
	if (!url || !url.startsWith(PROTOCOL)) {
		return null;
	}
	const myPath = url.substr(PROTOCOL.length);
	if(process.env === 'win32')	myPath.pop();
	return myPath;
}