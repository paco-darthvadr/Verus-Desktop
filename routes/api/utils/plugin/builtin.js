const path = require('path')

const ReservedPluginTypes = {
  VERUS_DESKTOP_MAIN: "VERUS_DESKTOP_MAIN",
  VERUS_DESKTOP_AUTHENTICATOR: "VERUS_DESKTOP_AUTHENTICATOR"
}

// Builtin plugins have access to all permissions by default
const BuiltinPlugins = {
  [ReservedPluginTypes.VERUS_DESKTOP_MAIN]: {
    name: "Verus Desktop",
    devPort: 3000
  },
  [ReservedPluginTypes.VERUS_DESKTOP_AUTHENTICATOR]: {
    name: "Authenticator",
    path: path.join(
      __dirname,
      "../",
      "../",
      "../",
      "../",
      "assets",
      "plugins",
      "builtin",
      "verus-desktop-authenticator"
    ),
    devPort: 3001
  },
};

module.exports = {
  BuiltinPlugins,
  ReservedPluginTypes
}