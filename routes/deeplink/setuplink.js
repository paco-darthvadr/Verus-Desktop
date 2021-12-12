const path = require('path')

function setuplink(app) {
  if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.setAsDefaultProtocolClient('i5JtwbP6zyMEAy9LLnRAGLgJQGdRFfsAu4', process.execPath, [path.resolve(process.argv[1])])
    }
  } else {
    app.setAsDefaultProtocolClient('i5JtwbP6zyMEAy9LLnRAGLgJQGdRFfsAu4')
  }
}

module.exports = setuplink