const axios = require('axios')

function parseError(error) {
  return error.response ? error.response.data.message : error.toString()
}

async function formatResponse(call, returnFull) {
  try {
    const res = await call();
    return returnFull ? res : res.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

function requestContentType(contentType, method, url, body = {}, options = {}, returnFull = false) {
  return formatResponse(() => {
    switch (method) {
      case "GET":
        return axios.get(url, {
          ...options,
          headers:
            options.headers != null
              ? { ...options.headers, "Content-Type": contentType }
              : { "Content-Type": contentType },
        });
      case "POST":
        return axios.post(url, body, {
          ...options,
          headers:
            options.headers != null
              ? { ...options.headers, "Content-Type": contentType }
              : { "Content-Type": contentType },
        });
      default:
        throw new Error(method + " is not a valid method type.");
    }
  }, returnFull);
}

function requestJson(method, url, body = {}, options = {}, returnFull = false) {
  return requestContentType("application/json", method, url, body, options, returnFull)
}

function requestXml(method, url, body = {}, options = {}, returnFull = false) {
  return requestContentType("application/xml", method, url, body, options, returnFull)
}

module.exports = {
  requestJson,
  requestXml
}