import { app, BrowserWindow, dialog, Menu } from 'electron';
import { autoUpdater } from 'electron-updater';
import fs from 'fs';
import { checkForUpdates } from './updater/updater';
import menu from './menu/menu';
import errors from './alerts/errors';
import { logToRenderer, stripCustomProtocol} from './untils';
const { ipcMain, protocol} = require('electron');

const path = require('path');
const ProgressBar = require('electron-progressbar');

const PROTOCOL = 'myprotocol://'
const PROTOCOL_PREFIX = PROTOCOL.split(':')[0]

// Main app URL.
const mainWinURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/`
	: `file://${__dirname}/index.html`;

// Child app URL.
const childWinURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/child.html`
    : `file://${__dirname}/child.html`;

// Set `__static` path to static files in production
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\');
}


// Globals
let initialPath = null;
let mainWindow = null;
let childWindow = null;

let closeWindowFlag = false;
let closeProgressBar = null;

const makeSingleInstance = () => {
	const gotTheLock = app.requestSingleInstanceLock();
	if (!gotTheLock) {
		app.quit();
		return ;
	}

	app.on('second-instance', (event, argv, workingDirectory) => {
		if (mainWindow) {
			if (mainWindow.isMinimized())	mainWindow.restore();

			mainWindow.focus();
			if(process.platform === 'win32')
				mainWindow.webContents.send('setPageTitle', stripCustomProtocol(argv.pop(), PROTOCOL));
		}
	})

}

async function createMainWindow() {
	const windowOptions = {
		width: 1275,
		height: 700,
		minWidth: 1275,
		minHeight: 700,
		icon: path.join(__dirname, '../renderer/assets/images/icons/png/256.png'),
		show: false,
		autoHideMenuBar: true,
		backgroundColor: '#2B2C2D',
		webPreferences: {
			nodeIntegration: true
		}
	};


	mainWindow = new BrowserWindow(windowOptions);

	// Load the main browser window with the Wagerr vue application.
	mainWindow.loadURL(mainWinURL);

	// Add the main application menu to the UI.
	Menu.setApplicationMenu(menu);

	// Close the window action
	mainWindow.on('close', async event => {
		if (closeWindowFlag === false && process.platform !== 'darwin') {
			// Prevent the default close action before daemon is completely stopped.
			app.quit();
		}
	});

	// Reset the main window on close.
	mainWindow.on('closed', async () => {
		mainWindow = null;
		childWindow = null;
		initialPath = null;
		app.quit();
	});

	// Show a popup dialog if the main window is unresponsive.
	mainWindow.on('unresponsive', () => {
		errors.wagerrdUnresponsive();
	});

	// Once electron app is ready then display the vue UI.
	mainWindow.once('ready-to-show', () => {
		const network = process.env.NODE_ENV !== 'development' ? 'Mainnet' : 'Testnet';
		const title = `Protocol Electron App - ${network}`;

		
		mainWindow.setTitle(title);
		mainWindow.show();

		if (initialPath) {
			mainWindow.webContents.send('setPageTitle', initialPath);
			initialPath = null;
		}

		protocol.registerHttpProtocol(PROTOCOL_PREFIX, (req, cb) => {
			const url = req.url;
			const customProtocolPath = stripCustomProtocol(url, PROTOCOL);
			const msg = `My protocol path: ${customProtocolPath}`;
			logToRenderer(msg, mainWindow);
			mainWindow.webContents.send('setPageTitle', customProtocolPath);
		}, (err) => {
			if (!err) {
				console.log('registered myprotocol protocol')
			} else {
				console.error('could not register todo protocol')
				console.error(err)
			}
		})
		setImmediate(() => {
			mainWindow.focus();
		});
	});

	// If running in dev mode then also open dev tools on the main window.
	mainWindow.webContents.on('did-finish-load', () => {
		//console.log('did-finish-loading...');
		//mainWindow.webContents.openDevTools();
	});

	// If the main window has crashed, clear it.
	mainWindow.webContents.on('crashed', () => {
		mainWindow = null;
		childWindow = null;
	});
}

/**
 *
 * @returns {Promise<void>}
 */
async function init() {
	console.log('\x1b[32mInitialising MyProtocol Electron App...\x1b[0m');
	// For Mac there is no need to get path from the process argv
	// Just needed for winOS
	if( process.platform === 'win32')
		initialPath = stripCustomProtocol(process.argv.pop(), PROTOCOL);
	await createMainWindow();
}

app.on('ready', async () => {
	console.log('\x1b[32mMyProtocol Electron App starting...\x1b[0m');
	makeSingleInstance();
	await init();
	// Check for updates only for the packaged app.
	//   if (process.env.NODE_ENV === 'production') {
	//     checkForUpdates();

	//     // If no updates available continue with initialising the app,
	//     // otherwise, updater.js would have caught the update-available event
	//     // and downloaded and restarted the app.
	//     autoUpdater.on('update-not-available', async () => {
	//       await init();
	//     });
	//   } else {
	//     await init();
	//   }
});

app.on('before-quit', async () => {
  console.log('\x1b[32mbefore-quit\x1b[0m');
});

app.on('will-quit', async () => {
  console.log('\x1b[32mwill-quit\x1b[0m');
});

app.on('window-all-closed', async () => {
  console.log('\x1b[32mwindow-all-closed\x1b[0m');
});

app.on('activate', async () => {
  if (!mainWindow) {
    await createMainWindow();
  }
});

// Mac OS X sends url to open via this event
// For Win OS it doesn't work
app.on('open-url', function (e, url) {
	console.log('open-url', url)
	if (url.startsWith('/')) {
	  url = url.substr(1)
	}
  
	
	// if the main window has not been created yet
	if (!initialPath)
		initialPath = stripCustomProtocol(url, PROTOCOL);
  
	if (mainWindow) {
		const customProtocolPath = stripCustomProtocol(url, PROTOCOL);
		const msg = `todopath: ${customProtocolPath}`;
		logToRenderer(msg, mainWindow);
		mainWindow.webContents.send('setPageTitle', customProtocolPath);
	}
})

// ipcMain Handlers
ipcMain.on('showChildWin', async (event, arg) => {
	console.log('herer')
	const savePath = dialog.showSaveDialog(null, {})
	console.log(savePath)
	// if (childWindow) {
	// 	if (!arg) childWindow.hide();
	// 	else childWindow.show();
	// 	return;
	// }
	// const windowOptions = {
	// 	width: 600,
	// 	height: 400,
	// 	minWidth: 600,
	// 	minHeight: 400,
	// 	icon: path.join(__dirname, '../renderer/assets/images/icons/png/256.png'),
	// 	show: false,
	// 	autoHideMenuBar: true,
	// 	backgroundColor: '#2B2C2D',
	// 	webPreferences: {
	// 		nodeIntegration: true
	// 	}
	// };
	// if (childWindow)	return;

	// childWindow = new BrowserWindow(windowOptions);

	// // Load the main browser window with the Wagerr vue application.
	// childWindow.loadURL(childWinURL);

	// // Reset the child window on close.
	// childWindow.on('closed', async () => {
	// 	childWindow = null;
	// });


	// // Once electron app is ready then display the vue UI.
	// childWindow.once('ready-to-show', () => {
	//   const network = process.env.NODE_ENV !== 'development' ? 'Mainnet' : 'Testnet';
	//   const title = `Protocol Child Electron App - ${network}`;
  
	//   childWindow.setTitle(title);
	//   childWindow.show();
	// });
  
	// // If running in dev mode then also open dev tools on the main window.
	// childWindow.webContents.on('did-finish-load', () => {
	// // 	console.log('child window did-finish-loading...');
	// //  childWindow.webContents.openDevTools()
	// });
  
	// // If the main window has crashed, clear it.
	// childWindow.webContents.on('crashed', () => {
	// 	childWindow = null;
	// });
});

ipcMain.on('sendClickedLink', (event, href) => {
	childWindow && childWindow.webContents.send('sendClickedLink', href);
});
