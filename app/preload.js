const { ipcRenderer, remote } = require('electron');
const { fork } = require('child_process');

function init() {
  // add global variables to your web page
  window.$backend = {
    ipcRenderer,
  };
}

init();
