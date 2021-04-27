
const Promise = require('bluebird');

module.exports = (api) => {
  api.native.get_all_currencies = (coin, query = {}) => {
    return new Promise((resolve, reject) => {
      api.native
        .callDaemon(coin, "listcurrencies", [query])
        .then(async (allcurrencies) => {
          // Run through to cache
          allcurrencies.map((currency) => {
            const definition = currency.currencydefinition;

            if (
              !api.native.cache.currency_definition_cache[definition.currencyid]
            ) {
              api.native.cache.currency_definition_cache[
                definition.currencyid
              ] = definition;
            }
          });

          const currencyObjects = [];

          for (currency of allcurrencies) {
            const { systemid } = currency.currencydefinition;
            const parent_name = (
              await api.native.get_currency_definition(coin, systemid)
            ).name.toUpperCase();

            currencyObjects.push({
              parent_name,
              ...currency.currencydefinition,
              bestheight: currency.bestheight,
              lastconfirmedheight: currency.lastconfirmedheight,
              bestcurrencystate: currency.bestcurrencystate,
            });
          }

          //TODO: Change getcurrency instead of listcurrencies so they are the same
          resolve(currencyObjects);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  // Returns an object with key = currency name and value = currency object
  // for every currency name mentioned in the input array
  api.native.get_currency_data_map = (chain, currencies = []) => {
    return new Promise(async (resolve, reject) => {
      let res = {
        currencyData: {},
        currencyNames: {}
      }

      for (let i = 0; i < currencies.length; i++) {
        const currency = currencies[i]

        try {
          const fullCurrencyObj = await api.native.get_currency(chain, currency)

          if (
            fullCurrencyObj.currencyid != null &&
            fullCurrencyObj.name != null
          ) {
            res.currencyData[fullCurrencyObj.name] = fullCurrencyObj
            res.currencyNames[fullCurrencyObj.currencyid] = fullCurrencyObj.name
          }
        } catch(err) {
          api.log(`Error fetching currency: "${currency}"!`, "getCurrencies")
          api.log(err, "getCurrencies")
        }
      }

      resolve(res)
    });
  };

  api.setPost('/native/get_all_currencies', (req, res, next) => {
    const coin = req.body.chainTicker;
    const query = req.body.query;

    api.native.get_all_currencies(coin, query)
    .then((currencies) => {
      const retObj = {
        msg: 'success',
        result: currencies,
      };

      res.send(JSON.stringify(retObj));
    })
    .catch(error => {
      const retObj = {
        msg: 'error',
        result: error.message,
      };

      res.send(JSON.stringify(retObj));
    })
  });

  api.setPost('/native/get_currency_data_map', (req, res, next) => {
    const coin = req.body.chainTicker;
    const currencies = req.body.currencies;

    api.native.get_currency_data_map(coin, currencies)
    .then((currencies) => {
      const retObj = {
        msg: 'success',
        result: currencies,
      };

      res.send(JSON.stringify(retObj));
    })
    .catch(error => {
      const retObj = {
        msg: 'error',
        result: error.message,
      };

      res.send(JSON.stringify(retObj));
    })
  });

  return api;
};
