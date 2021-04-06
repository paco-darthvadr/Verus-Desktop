const ethers = require('ethers');
const standardizeEthTxObj = require('../utils/standardization/standardizeEthTxObj');

module.exports = (api) => {  
  api.setGet('/eth/get_transactions', async (req, res, next) => {
    try {
      res.send(JSON.stringify({
        msg: 'success',
        result: await api.eth.get_standardized_wallet_transactions(),
      }));  
    } catch(e) {
      res.send(JSON.stringify({
        msg: 'error',
        result: e.message,
      }));  
    }
  });
  
  api.eth.get_transactions = async (address) => {
    if (api.eth.interface != null) {
      return await api.eth.interface.EtherscanProvider.getHistory(address)
    } else {
      throw new Error("Cannot get transaction list for inactive coin ETH")
    }
  };

  api.eth.get_standardized_wallet_transactions = async () => {
    if (api.eth.wallet != null) {
      let processedTxs = standardizeEthTxObj(
        await api.eth.get_transactions(api.eth.wallet.address),
        api.eth.wallet.address
      );
    
      for (let i = 0; i < processedTxs.length; i++) {
        let tx = processedTxs[i]
    
        if (tx.type === 'self') {
          const txReceipt = await api.eth.get_transaction(tx.txid)
          const fee = ethers.utils
            .formatEther(
              txReceipt.gasUsed.mul(ethers.utils.parseEther(tx.gasPrice))
            )
            .toString();
    
          processedTxs[i] = { ...tx, ...txReceipt, amount: fee, fee }
        }
      }

      return processedTxs
    } else {
      throw new Error("No wallet authenticated, cannot get wallet transactions for ETH")
    }
  }

  api.eth.get_transaction = async (txid) => {
    if (api.eth.interface != null) {
      // let cachedReceipts = api.eth.cache.tx_cache;

      // if (cachedReceipts[txid] != null) {
      //   return cachedReceipts[txid]
      // } 

      const txReceipt = await api.eth.interface.DefaultProvider.getTransactionReceipt(txid)

      // if (txReceipt.confirmations >= 100) {
      //   api.eth.cache.tx_cache[txid] = txReceipt
      // }

      return txReceipt
    } else {
      throw new Error("Cannot get transaction for inactive coin ETH")
    }
  }

  return api;
};