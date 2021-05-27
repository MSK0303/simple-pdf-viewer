const {contextBridge} =  require('electron');
const {ipcRenderer} = require('electron');
const fs = require('fs'); //Node.jsのファイルシステムモジュール
const {pdfview } = require('electron-pdf-viewer');

const createNewWindow = () => {
    console.log("api.createNewWindow");
    ipcRenderer.invoke('create-new-window')
                .then((result)=>{
                    console.log("create new window:id="+result);
                });
}

const getWindowId = () => {
    console.log("api.getWindowId");
    ipcRenderer.invoke('get-window-id')
    .then((result)=>{
        console.log("this window id="+result);
    });
}

contextBridge.exposeInMainWorld('api', {
    create_new_window: createNewWindow,
    get_window_id:getWindowId,
  }
)