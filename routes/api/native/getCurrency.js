module.exports = (api) => {
  // The only difference between this and get_currency is that this cannot
  // be used to derive non-static properties of a currency like bestcurrencystate
  api.native.get_currency_definition = async (chain, currencyid) => {
    if (api.native.cache.currency_definition_cache[currencyid]) {
      return api.native.cache.currency_definition_cache[currencyid]
    } else {
      const definition = await api.native.callDaemon(chain, 'getcurrency', [currencyid])

      api.native.cache.currency_definition_cache[currencyid] = definition
      return definition
    }
  }

  api.native.get_currency = async (chain, currencyid) => {
    try {
      const currencyObject = await api.native.callDaemon(chain, 'getcurrency', [currencyid])
      const parent = await api.native.get_currency_definition(chain, currencyObject.systemid)

      if (!api.native.cache.currency_definition_cache[currencyid]) {
        api.native.cache.currency_definition_cache[currencyid] = currencyObject
      }

      return {
        ...currencyObject,
        parent_name: parent.name.toUpperCase()
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