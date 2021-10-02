const Promise = require('bluebird');
const { requestJson } = require('../utils/request/request')

module.exports = (api) => {
  api.fiat.supportedCurrencies = [
    'AUD', 
    'BRL', 
    'GBP', 
    'BGN',
    'CAD',
    'HRK',
    'CZK',
    'CNY',
    'DKK',
    'EUR',
    'HKD',
    'HUF',
    'INR',
    'IDR',
    'ILS',
    'JPY',
    'KRW',
    'MYR',
    'MXN',
    'NZD',
    'NOK',
    'PHP',
    'PLN',
    'RON',
    'RUB',
    'SGD',
    'ZAR',
    'SEK',
    'CHF',
    'THB',
    'TRY',
    'USD'
  ]

  /**
   * Fetches price for specified cryptocurrency (uppercase ticker) from atomic explorer 
   * in specified currency. If no currency specified, fetches price in all available currencies.
   */
  api.fiat.get_fiatprice = (coin, currency = null) => {
    return new Promise(async (resolve, reject) => {  
      const url = `https://www.atomicexplorer.com/api/mm/prices/v2?currency=${
        currency != null ? currency : api.fiat.supportedCurrencies.join()
      }&coins=${coin}&pricechange=true`

      try {
        const res = await requestJson(
          "GET",
          url
        );
  
        if (res.result && res.msg === 'success') {
          if (!res.result.hasOwnProperty(coin)) {
            reject(new Error(`No fiat value found for ${coin}.`))
          } else if (currency != null && !res.result[coin].hasOwnProperty(currency)) {
            reject(new Error(`Fiat currency ${currency} not supported by atomic explorer.`))
          } else {
            resolve({
              msg: res.msg,
              result: res.result[coin]
            });
          }
        } else {
          reject(new Error(res.result))
        }
      } catch(e) {
        api.log(`atomic explorer price error: unable to request ${url}`, 'fiat.prices');
        reject(new Error(`Unable to request ${url}`))
      }
    });
  }

  //TODO: Clean this up to be one function without making GUI component messier
  api.setGet('/native/get_fiatprice', (req, res, next) => {
    const coin = req.query.chainTicker
    const currency = req.query.currency

    api.fiat.get_fiatprice(coin, currency)
    .then((priceObj) => {
      res.send(JSON.stringify(priceObj)); 
    })
    .catch(e => {
      res.send(
        JSON.stringify({
          msg: "error",
          result:
            e.message != null && e.message.includes("No fiat value found")
              ? ("No fiat value found for " + coin)
              : e.message,
        })
      ); 
    })
  });

  api.setGet('/eth/get_fiatprice', (req, res, next) => {
    const coin = req.query.chainTicker
    const currency = req.query.currency

    api.fiat.get_fiatprice(coin, currency)
    .then((priceObj) => {
      res.send(JSON.stringify(priceObj)); 
    })
    .catch(e => {
      res.send(JSON.stringify({
        msg: 'error',
        result:
            e.message != null && e.message.includes("No fiat value found")
              ? ("No fiat value found for " + coin)
              : e.message,
      })); 
    })
  });

  api.setGet('/erc20/get_fiatprice', async (req, res, next) => {
    const chainTicker = req.query.chainTicker
    const currency = req.query.currency

    if (api.erc20.contracts[chainTicker] != null) {
      api.fiat
        .get_fiatprice(api.erc20.contracts[chainTicker].symbol, currency)
        .then((priceObj) => {
          res.send(JSON.stringify(priceObj));
        })
        .catch((e) => {
          res.send(
            JSON.stringify({
              msg: "error",
              result:
                e.message != null && e.message.includes("No fiat value found")
                  ? ("No fiat value found for " + chainTicker)
                  : e.message,
            })
          );
        });
    } else {
      res.send(JSON.stringify({
        msg: 'error',
        result: `No interface for ${chainTicker}`
      })); 
    }
  });

  api.setGet('/electrum/get_fiatprice', (req, res, next) => {
    const coin = req.query.chainTicker
    const currency = req.query.currency

    api.fiat.get_fiatprice(coin, currency)
    .then((priceObj) => {
      res.send(JSON.stringify(priceObj)); 
    })
    .catch(e => {
      res.send(
        JSON.stringify({
          msg: "error",
          result:
            e.message != null && e.message.includes("No fiat value found")
              ? "No fiat value found for " + coin
              : e.message,
        })
      ); 
    })
  });

  return api
}
