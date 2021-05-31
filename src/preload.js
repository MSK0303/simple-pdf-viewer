const {contextBridge} =  require('electron');
const {ipcRenderer} = require('electron');
const path = require('path');
const fs = require('fs'); //Node.jsのファイルシステムモジュール


/**************************************************************************************************
* api
**************************************************************************************************/
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

const showPdfView = () => {
    const view_content = document.getElementById("viewer");
    view_content.innerHTML = '';

    const ifram = document.createElement('iframe');
    const file_path = path.resolve(__dirname,"../test/kyoshiharamcg.pdf");
    ifram.src = path.resolve(__dirname,`../public/pdfjs/web/viewer.html?file=${file_path}`);
    view_content.appendChild(ifram);
}


contextBridge.exposeInMainWorld('api', {
    create_new_window: createNewWindow,
    get_window_id:getWindowId,
    show_pdf_view:showPdfView,
  }
)
/**************************************************************************************************
* functions
**************************************************************************************************/
const openPdfView = (file_path) => {
    const view_content = document.getElementById("viewer");
    view_content.innerHTML = '';

    const ifram = document.createElement('iframe');
    ifram.src = path.resolve(__dirname,`../public/pdfjs/web/viewer.html?file=${file_path}`);
    view_content.appendChild(ifram);
}


/**************************************************************************************************
* handler
**************************************************************************************************/
ipcRenderer.on("open-pdf",(event,file_path) => {
    console.log("open file path : "+file_path);
    openPdfView(file_path);
})