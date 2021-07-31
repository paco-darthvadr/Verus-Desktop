const passwdStrength = require('passwd-strength');
const CryptoJS = require("crypto-js");
var blake2b = require('blake2b');
const { randomBytes } = require('crypto');

const decrypt = (data, key) => CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8);
const encrypt = (data, key) => CryptoJS.AES.encrypt(data, key).toString()

module.exports = (api) => {
  api.seenTimes = []

  api.checkToken = (validity_key, path, time) => {
    if (api.seenTimes.includes(time)) throw new Error("Cannot repeat call");
    else if (Math.abs(new Date().valueOf() - time) > 600000) throw new Error("Cannot make expired call.");
    else {
      let newSeenTimes = [...api.seenTimes, time]
      newSeenTimes = newSeenTimes.filter(x => (x > time - 600000 && x < time + 600000))

      api.seenTimes = newSeenTimes
    }

    const token = api.appSecretToken

    var hash = blake2b(64)

    hash.update(Buffer.from(time.toString()))
    hash.update(Buffer.from(token))
    hash.update(Buffer.from(path))

    return hash.digest('hex') === validity_key
  };

  api.setPost = (url, handler, forceEncryption = false) => {
    api.post(url, async (req, res, next) => {
      res.type('json')

      if (api.appConfig.general.main.livelog) {
        api.writeLog(`POST, url: ${url}, forceEncryption: ${forceEncryption}`, 'api.http.request')
      }

      const encrypted = req.body.encrypted || forceEncryption

      try {
        let payload = null
        
        try {
          if (
            !api.checkToken(
              req.body.validity_key,
              req.body.path,
              Number(req.body.time)
            )
          ) 
            throw new Error("Incorrect API validity key");
        } catch(e) {
          res.status(401);
          throw e
        }
        
        
        if (!encrypted) {
          payload = req.body.payload;
        } else {
          payload = JSON.parse(decrypt(req.body.payload, api.apiShieldKey))
        }
        
        handler({...req, body: payload}, {
          ...res,
          send: async (data) => {
            res.send(
              JSON.stringify(
                encrypted
                  ? { payload: encrypt(data, api.apiShieldKey) }
                  : { payload: data }
              )
            );
          }
        }, next)
      } catch(e) {  
        api.log('HTTP POST error', 'setPost')
        api.log(e, 'setPost')

        res.send(
          JSON.stringify({
            payload: JSON.stringify({
              msg: "error",
              result: e.message,
            }),
          })
        );
      }
    })
  }

  api.setGet = (url, handler) => {
    api.get(url, async (req, res, next) => {
      res.type('json')

      try {  
        try {
          if (
            !api.checkToken(
              req.query.validity_key,
              req.query.path,
              Number(req.query.time)
            )
          )
            throw new Error("Incorrect API validity key");
        } catch(e) {
          res.status(401);
          throw e
        }
        
        if (api.appConfig.general.main.livelog) {
          let req_id = randomBytes(8).toString('hex')
          
          handler(req, {
            send: (jsonString) => {
              api.writeLog(
                JSON.stringify(JSON.parse(jsonString), null, 2),
                `api.http.response ${req_id}`
              );
            }
          }, next)
          
          api.writeLog(`GET, url: ${url}`, `api.http.request ${req_id}`)
        }
        
        handler(req, res, next)
      } catch(e) {  
        api.log('HTTP GET error', 'setGet')
        api.log(e, 'setGet')

        res.send(JSON.stringify({
          payload: JSON.stringify({
            msg: "error",
            result: e.message,
          }),
        }));
      }
    })
  }

  api.checkStringEntropy = (str) => {
    // https://tools.ietf.org/html/rfc4086#page-35
    return passwdStrength(str) < 29 ? false : true;
  };

  api.isWatchOnly = () => {
    return api.argv && api.argv.watchonly === 'override' ? false : api._isWatchOnly;
  };

  return api;
};