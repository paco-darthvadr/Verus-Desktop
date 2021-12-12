const { AUTHENTICATION_REQUEST } = require("./utils/constants/supported_dls");

module.exports = (api) => {
  api.dlhandler = (url) => {
    const handlers = {
      [AUTHENTICATION_REQUEST]: (url) => {
        const value = url.searchParams.get('value')
        
        return api.loginConsentUi.request(
          JSON.parse(Buffer.from(value, "base64").toString("ascii")),
          {
            id: "VERUS_DESKTOP_MAIN",
            search_builtin: true
          }
        )
      }
    }

    return handlers[url.pathname.replace(/\//g, "")](url)
  }

  return api;
};