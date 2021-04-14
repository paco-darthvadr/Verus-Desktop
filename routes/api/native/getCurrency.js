const { IS_PBAAS_FLAG } = require("../utils/constants/currency_flags");
const checkFlag = require("../utils/flags");

module.exports = (api) => {
  api.native.get_currency = async (chain, name, systemid) => {
    const system = systemid == null ? chain : systemid

    try {
      const parent = await api.native.callDaemon(chain, 'getcurrency', [system])

      try {
        const current = await api.native.callDaemon(chain, 'getcurrency', [name])

        if (
          current.systemid === parent.currencyid ||
          checkFlag(current.options, IS_PBAAS_FLAG)
        ) {
          return {
            ...current,
            parent_name: parent.name,
          };
        }
      } catch(e) {}

      return {
        ...await api.native.callDaemon(chain, 'getcurrency', [`${name}.${parent.name}`]),
        parent_name: parent.name
      }
    } catch(e) {
      throw e
    }
  };

  api.setPost('/native/get_currency', async (req, res, next) => {
    const { chainTicker, name, systemid } = req.body

    try {
      const retObj = {
        msg: 'success',
        result:  await api.native.get_currency(chainTicker, name, systemid),
      };
  
      res.send(JSON.stringify(retObj));  
    } catch(e) {
      const retObj = {
        msg: 'error',
        result: e.message,
      };
  
      res.send(JSON.stringify(retObj)); 
    }
  });
 
  return api;
};