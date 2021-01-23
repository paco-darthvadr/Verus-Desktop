const {
  contextBridge,
  shell
} = require("electron");
const fs = require('fs')
const os = require('os')
const url = require('url')

const generateOpenExternalSafe = require('../../workers/openExternalSafe')
const arch = require('arch');
const { appSecretToken, apiShieldKey } = require("../keys");
const chainParams = require("../../chainParams")
const assetChainPorts = require("../../ports")
const version = require('../../../version.json');
const { pathsAgama } = require("../../api/pathsUtil");
const appConfig = require("../../appConfig").config

let apiShell = {}
pathsAgama(apiShell, os.platform() === "win32" ? process.env.APPDATA : process.env.HOME)

contextBridge.exposeInMainWorld("bridge", {
  getConfigSync: () =>
    JSON.parse(
      fs.readFileSync(`${apiShell.paths.agamaDir}/config.json`, "utf8")
    ),
  getSecretsSync: () => JSON.parse(fs.readFileSync(`${apiShell.paths.agamaDir}/secrets.json`, "utf8")).data,
  defaultConfig: appConfig,
  shell: {
    openExternal: generateOpenExternalSafe(shell, url),
  },
  assetChainPorts,
  appBasicInfo: {
    name: "Verus Desktop",
    mode: global.USB_MODE ? "usb" : "standard",
    version: version.version,
  },
  arch: arch(),
  chainParams,
  keys: {
    appSecretToken: appSecretToken,
    apiShieldKey: apiShieldKey,
  },
});