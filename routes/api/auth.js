const passwdStrength = require('passwd-strength');
const { randomBytes } = require('crypto');
const iocane = require('iocane');
const session = iocane.createSession().use('gcm')

const decrypt = session.decrypt.bind(session);
const encrypt = session.encrypt.bind(session);

module.exports = (api) => {
  api.checkToken = (validity_key, reqtype = 'POST') => {
    return new Promise(async (resolve) => {
      const hash = reqtype === 'POST' ? 'appPostSessionHash' : 'appNonPostSessionHash'

      if (api[hash] === validity_key) {        
        api.setVar(hash, randomBytes(32).toString('hex'))
        global.app[hash] = api[hash]
  
        resolve(true)
      } else resolve(false)
    })
  };

  api.setPost = (url, handler) => {
    api.post(url, async (req, res, next) => {
      const encrypted = req.body.encrypted

      try {
        let payload = null
        
        if (!encrypted) {
          if (!(await api.checkToken(req.body.validity_key))) throw new Error("Incorrect API validity key")
          else {
            payload = req.body.payload
          }
        } else payload = JSON.parse(await decrypt(req.body.payload, api.apiShieldKey))
        
        handler({...req, body: payload}, {
          ...res,
          send: async (data) => {
            res.send(
              JSON.stringify(
                encrypted
                  ? { payload: await encrypt(data, api.apiShieldKey) }
                  : { payload: data }
              )
            );
          }
        }, next)
      } catch(e) {  
        api.log('HTTP POST authorization error', 'setPost')
        api.log(e, 'setPost')

        res.send(
          JSON.stringify({
            payload: JSON.stringify({
              msg: "error",
              result: "Unauthorized Access",
            }),
          })
        );
      }
    })
  }

  api.setGet = (url, handler) => {
    api.get(url, async (req, res, next) => {
      try {        
        if (!(await api.checkToken(req.query.validity_key, 'GET'))) throw new Error("Incorrect API validity key")
        
        handler(req, res, next)
      } catch(e) {  
        api.log('HTTP GET authorization error', 'setPost')
        api.log(e, 'setPost')

        res.send(JSON.stringify({
          payload: JSON.stringify({
            msg: "error",
            result: "Unauthorized Access",
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