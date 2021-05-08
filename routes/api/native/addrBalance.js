const Promise = require('bluebird');
const getObjBytes = require('../utils/objectUtil/getBytes')
const {
  RPC_INVALID_ADDRESS_OR_KEY
} = require("../utils/rpc/rpcStatusCodes");
const RpcError = require("../utils/rpc/rpcError");

module.exports = (api) => {      
  // Gets an address balance (z_getbalance), txCount and zTotalBalance are used 
  // to check if the cache needs to be cleared and re-built
  api.native.get_addr_balance = async (coin, address, useCache, txCount = -1, zTotalBalance = -1) => {
    const cacheAddrBalanceResult = (result) => {
      let data = api.native.cache.addr_balance_cache[coin].get("data")
      data[address] = result

      api.native.cache.addr_balance_cache[coin].set("data", data)
    }

    if (useCache) {
      if (
        api.native.cache.addr_balance_cache[coin] != null
      ) {  
        if (txCount !== api.native.cache.addr_balance_cache[coin].get("tx_count")) {
          api.native.cache.addr_balance_cache[coin].set("tx_count", txCount)
          api.native.cache.addr_balance_cache[coin].del("data");
        }

        if (zTotalBalance !== api.native.cache.addr_balance_cache[coin].get('total_balance')) {
          api.native.cache.addr_balance_cache[coin].set("total_balance", zTotalBalance)
          if (api.native.cache.addr_balance_cache[coin].get("data") != null) {
            api.native.cache.addr_balance_cache[coin].del("data");
          }
        }
      }
        
      if (api.native.cache.addr_balance_cache[coin] == null) {
        api.native.cache.addr_balance_cache[coin] = api.create_sub_cache(`native.cache.addr_balance_cache.${coin}`)
        api.native.cache.addr_balance_cache[coin].set("tx_count", -1)
        api.native.cache.addr_balance_cache[coin].set("total_balance", -1)
        api.native.cache.addr_balance_cache[coin].set("data", {})
      } else if (api.native.cache.addr_balance_cache[coin].get('data') == null) {
        api.native.cache.addr_balance_cache[coin].set("data", {})
      }
  
      if (api.native.cache.addr_balance_cache[coin].get('data')[address] != null) {  
        return new Promise((resolve, reject) => {
          if (api.native.cache.addr_balance_cache[coin].get('data')[address] instanceof RpcError) {
            reject(api.native.cache.addr_balance_cache[coin].get('data')[address])
          } else resolve(api.native.cache.addr_balance_cache[coin].get('data')[address])
        })
      }
    }
    
    // Optimization, TODO: Apply to all verusd coins
    const useGetCurrencyBalance = (coin === 'VRSC' || coin === 'VRSCTEST') && address[0] !== 'z'

    return new Promise((resolve, reject) => {
      api.native
        .callDaemon(coin, useGetCurrencyBalance ? "getcurrencybalance" : "z_getbalance", [address])
        .then(balance => {    
          let balanceObj = useGetCurrencyBalance ? balance : {
            [coin]: Number(balance)
          }  

          if (balanceObj[coin] == null) balanceObj[coin] = 0

          if (useCache) cacheAddrBalanceResult(balanceObj)
          resolve(balanceObj);
        })
        .catch(err => {
          if (err.code === RPC_INVALID_ADDRESS_OR_KEY) cacheAddrBalanceResult(err)
          
          reject(err);
        });
    });
  };

  return api;
};