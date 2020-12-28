
const Promise = require('bluebird');
const { IS_FRACTIONAL } = require('../utils/constants/currency_flags');
const checkFlag = require('../utils/flags');

module.exports = (api) => {    
  // Derives possible conversion paths between source and destination currencies
  // (or all possible destinations if destination is null)
  api.native.get_conversion_paths_rec = (
    chain,
    src,
    dest = null,
    includeVia = false,
    ignoreCurrencies = [],
    via = null,
    root
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        const source =
          typeof src === "string"
            ? await api.native.get_currency(chain, src)
            : src;
        const fractionalSource = checkFlag(source.options, IS_FRACTIONAL);

        api.native
          .callDaemon(
            chain,
            "getcurrencyconverters",
            dest === null ? [source.currencyid] : [source.currencyid, dest]
          )
          .then(async (paths) => {
            let convertables = {};

            for (const path of paths) {
              const currencyName = Object.keys(path)[0];
              let pricingCurrencyState;
              let price;

              if (via) {
                if (via.bestcurrencystate) {
                  pricingCurrencyState = via.bestcurrencystate;
                } else {
                  pricingCurrencyState = (
                    await api.native.get_currency(chain, via.currencyid)
                  ).bestcurrencystate;
                }

                price =
                  1 /
                  (pricingCurrencyState.currencies[source.currencyid]
                    .lastconversionprice /
                    pricingCurrencyState.currencies[
                      path[currencyName].currencyid
                    ].lastconversionprice);
              } else {
                if (path[currencyName].bestcurrencystate) {
                  pricingCurrencyState = path[currencyName].bestcurrencystate;
                } else {
                  pricingCurrencyState = (
                    await api.native.get_currency(chain, currencyName)
                  ).bestcurrencystate;
                }

                price =
                  1 /
                  pricingCurrencyState.currencies[source.currencyid]
                    .lastconversionprice;
              }

              convertables[path[currencyName].currencyid] = {
                via,
                destination: path[currencyName],
                price,
              };
            }

            if (fractionalSource && dest == null) {
              for (const reserve of source.currencies) {
                let pricingCurrencyState;

                if (
                  !convertables[reserve] &&
                  !ignoreCurrencies.includes(reserve)
                ) {
                  if (via) {
                    if (via.bestcurrencystate) {
                      pricingCurrencyState = via.bestcurrencystate;
                    } else {
                      pricingCurrencyState = (
                        await api.native.get_currency(chain, via.currencyid)
                      ).bestcurrencystate;
                    }

                    price =
                      1 /
                      (pricingCurrencyState.currencies[root.currencyid]
                        .lastconversionprice /
                        pricingCurrencyState.currencies[reserve]
                          .lastconversionprice);
                  } else {
                    if (source.bestcurrencystate) {
                      pricingCurrencyState = source.bestcurrencystate;
                    } else {
                      pricingCurrencyState = (
                        await api.native.get_currency(chain, src)
                      ).bestcurrencystate;
                    }

                    price =
                      pricingCurrencyState.currencies[reserve]
                        .lastconversionprice;
                  }

                  convertables[reserve] = {
                    via,
                    destination: await api.native.get_currency(chain, reserve),
                    price,
                  };
                }
              }
            }

            if (includeVia) {
              for (const key in convertables) {
                if (
                  checkFlag(
                    convertables[key].destination.options,
                    IS_FRACTIONAL
                  ) &&
                  !ignoreCurrencies.includes(key)
                ) {
                  convertables = {
                    ...convertables,
                    ...(await api.native.get_conversion_paths(
                      chain,
                      key,
                      dest,
                      false,
                      Object.keys(convertables),
                      convertables[key].destination,
                      source
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
      } catch (e) {
        reject(e);
      }
    });
  };

  api.native.get_conversion_paths = (
    chain,
    src,
    dest = null,
    includeVia = false,
    ignoreCurrencies = [],
    via = null,
    root
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        let paths = await api.native.get_conversion_paths_rec(chain, src, dest, includeVia, ignoreCurrencies, via, root)
        let toDelete;

        for (const key in paths) {
          if (paths[key].destination.currencyid === src || paths[key].destination.name === src) {
            toDelete = key
            break;
          }
        }

        if (toDelete) delete paths[toDelete]

        resolve(paths)
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