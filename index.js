const {app,BrowserWindow,Menu, dialog} = require('electron');
const path = require('path');
const {ipcMain} = require('electron');
const WindowStateKeeper = require('electron-window-state');


const createWindow =  () =>  {
    const state = WindowStateKeeper({
        defaultWidth: 800, //windowの幅
        defaultHeight: 900, //windowの高さ
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname+"/src/", 'preload.js')
        },
    })

    let win = new BrowserWindow({
        x: state.x,
        y: state.y,
        width: state.width,
        height: state.height,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname+"/src/", 'preload.js')
        },
    });
    win.loadFile('src/index.html');
    state.manage(win);
    win.webContents.openDevTools();
    return win.id;
}

const openPdfFile = () => {
    //ipcでレンダラープロセスにメッセージをpathを送ってそのpathでPDFを開く
    const w = BrowserWindow.getFocusedWindow();
    dialog.showOpenDialog(w,{
        properties:["openFile"],
        filters: [
            {name:"PDF Files",extensions:["pdf"]},
        ],
    }).then((result) => {
        if(!result.canceled)
        {
            console.log("openPdfFile: "+result.filePaths[0]);
            const file_path = result.filePaths[0];
            w.webContents.send("open-pdf",file_path);
        }
    }).catch(err => {
        dialog.showErrorBox(err.code+err.errno,err.message);
    });
}

const createMenu = () => {
    let menu_temp = [
        {
            label: "ファイル",
            submenu: [
                {
                    label:"New",
                    click: () => {
                    console.log("New Menu.");
                    createWindow();
                    }
                },
                {
                    label:"Open",
                    click: () => {
                        console.log("Open");
                        openPdfFile();
                    }
                },
                {
                    label:"File",
                    click: () => {
                    console.log("File Menu.");
                    createWindow();
                    }
                },
                {type: "separator"},
                {
                    label:"Quit",
                    click: () => {
                    console.log("Quit Menu.");
                    app.quit();
                    }
                },
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

ipcMain.handle('drop-except-for-pdf',(event) => {
    console.log("ipcMain.drop-except-for-pdf");
    dialog.showErrorBox("Caution!","PDFファイル以外がドロップされました");
    return "OK";
})