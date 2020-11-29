
const Promise = require('bluebird');
const { IS_FRACTIONAL } = require('../utils/constants/currency_flags');
const checkFlag = require('../utils/flags');

module.exports = (api) => {    
  // Derives possible conversion paths between source and destination currencies
  // (or all possible destinations if destination is null)
  api.native.get_conversion_paths = (chain, src, dest = null, includeVia = false, ignoreCurrencies = [], via = null) => {
    return new Promise(async (resolve, reject) => {  
      try {
        const source = typeof src === 'string' ? await api.native.get_currency(chain, src) : src

        api.native
          .callDaemon(
            chain,
            "getcurrencyconverters",
            dest === null ? [source.currencyid] : [source.currencyid, dest]
          )
          .then(async (paths) => {
            let convertables = {};

            paths.forEach((path) => {
              const currencyName = Object.keys(path)[0];
              convertables[path[currencyName].currencyid] = {
                via,
                destination: path[currencyName],
              };
            });

            if (checkFlag(source.options, IS_FRACTIONAL) && dest == null) {
              for (const reserve of source.currencies) {
                if (
                  !convertables[reserve] &&
                  !ignoreCurrencies.includes(reserve)
                ) {
                  convertables[reserve] = {
                    via,
                    destination: await api.native.get_currency(chain, reserve),
                  };
                }
              }
            }

            if (includeVia) {
              for (const key in convertables) {
                if (!ignoreCurrencies.includes(key)) {
                  convertables = {
                    ...convertables,
                    ...(await api.native.get_conversion_paths(
                      chain,
                      key,
                      dest,
                      false,
                      Object.keys(convertables),
                      convertables[key].destination
                    )),
                  };
                }
              }
            }

            resolve(convertables);
          })
          .catch((err) => {
            reject(err);
          });
      } catch(e) {
        reject(e)
      }
    });
  };

  api.setPost('/native/get_conversion_paths', (req, res, next) => {
    const coin = req.body.chainTicker;
    const src = req.body.src;
    const dest = req.body.dest;
    const includeVia = req.body.includeVia

    api.native.get_conversion_paths(coin, src, dest, includeVia)
    .then((paths) => {  
      res.send(JSON.stringify({
        msg: 'success',
        result: paths,
      }));  
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