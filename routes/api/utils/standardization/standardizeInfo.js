const { requestJson } = require('../request/request');

const standardizeZecInfo = (info) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await requestJson(
        "GET",
        "https://api.zcha.in/v2/mainnet/network"
      );

      resolve({...info, longestchain: res.blockNumber})
    } catch(e) {
      reject(e)
    }
  })
}

const standardizationFns = {
  ['ZEC']: standardizeZecInfo
}

/**
 * Standardizes the behaviour of the get_info call to always include
 * utilized important values like 'longestchain' when they may not be
 * present, e.g., in ZEC. Returns a promise resolving to the standardized
 * info object.
 * 
 * @param {Object} info The info result object to standardize
 * @param {String} coin The coin ticker to standardize
 * @param {Object} api The api object (for logging purposes)
 */
const standardizeInfo = (info, coin, api) => {
  let standardizationPromises = []

  if (standardizationFns[coin] != null) {
    standardizationPromises.push(
      standardizationFns[coin](info)
    );
  } else {
    standardizationPromises = [info]
  }

  return new Promise((resolve, reject) => {
    Promise.all(standardizationPromises)
      .then(infoArr => resolve(infoArr[0]))
      .catch(e => {
        api.log(`info standardization failed for ${coin}, returning regular info object:`, 'standardizeInfo');
        api.log(e, 'standardizeInfo')
        resolve(info);
      });
  });
}

module.exports = standardizeInfo