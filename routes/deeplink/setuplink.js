const path = require('path')
const { WALLET_VDXF_KEY } = require('verus-typescript-primitives');

function setuplink(app) {
  if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.setAsDefaultProtocolClient(WALLET_VDXF_KEY.vdxfid, process.execPath, [path.resolve(process.argv[1])])
    }
  } else {
    app.setAsDefaultProtocolClient(WALLET_VDXF_KEY.vdxfid)
  }
}

module.exports = setuplink