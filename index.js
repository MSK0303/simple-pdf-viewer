const {app,BrowserWindow,Menu} = require('electron');
const path = require('path');
const {ipcMain} = require('electron');



const createWindow =  () =>  {
    let win = new BrowserWindow({
        width: 800, //windowの幅
        height: 600, //windowの高さ
		backgroundColor: 'white', //背景色を設定
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
    });
    win.loadFile('index.html');
    win.webContents.openDevTools();
    return win.id;
}

const createMenu = () => {
    let menu_temp = [
        {
            label: "ファイル",
            submenu: [
                {label:"New",click: () => {
                    console.log("New Menu.");
                    createWindow();
                }},
                {label:"File",click: () => {
                    console.log("File Menu.");
                    createWindow();
                }},
                {type: "separator"},
                {label:"Quit",click: () => {
                    console.log("Quit Menu.");
                    app.quit();
                }},
            ]
        },
    ];
    let menu = new Menu.buildFromTemplate(menu_temp);

    Menu.setApplicationMenu(menu);
}


createMenu();
app.whenReady().then(createWindow);


/**************************************************************************************************
* event handler
**************************************************************************************************/
app.on('window-all-closed',() => {
    if(process.platform !== 'darwin') {
        app.quit()
    }
});

ipcMain.handle('create-new-window',(event) => {
    console.log("ipcMain.create-new-window");
    const id = createWindow();
    return id;
})

ipcMain.handle('get-window-id',(event) => {
    console.log("ipcMain.get-window-id");
    win = BrowserWindow.getFocusedWindow();
    return win.id;
})