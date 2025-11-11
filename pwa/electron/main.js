const { app, BrowserWindow } = require('electron');  
const isDev = require('electron-is-dev');  
const serve = require('electron-serve');  
const path = require('path');  
  
const loadURL = serve({ directory: 'out' });  
  
let mainWindow;  
  
function createWindow() {  
  mainWindow = new BrowserWindow({  
    width: 1200,  
    height: 800,  
    webPreferences: {  
      nodeIntegration: false,  
      contextIsolation: true,  
    },  
  });  
  
  if (isDev) {  
    mainWindow.loadURL('http://localhost:3000');  
  } else {  
    loadURL(mainWindow);  
  }  
}  
  
app.whenReady().then(createWindow);