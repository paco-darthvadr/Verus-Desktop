// Shim for using old electron dialog format with new electron
const { dialog } = require('electron');

async function showMessageBox(browserWindow, options, callback) {
  const res = await dialog.showMessageBox(browserWindow, options)

  if (callback) callback(res.response, res.checkboxChecked)
}

async function showOpenDialog(browserWindow, options, callback) {
  const res = await dialog.showOpenDialog(browserWindow, options)

  if (callback) callback(res.filePaths)
}

module.exports = {
  dialog: {
    showOpenDialog,
    showMessageBox
  }
}