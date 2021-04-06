const ethers = require('ethers');
const standardizeEthTxObj = require('../utils/standardization/standardizeEthTxObj');

module.exports = (api) => {  
  api.setGet('/erc20/get_transactions', async (req, res, next) => {
    try {
      res.send(
        JSON.stringify({
          msg: "success",
          result: await api.erc20.get_standardized_wallet_transactions(
            req.query.chainTicker
          ),
        })
      );  
    } catch(e) {
      res.send(JSON.stringify({
        msg: 'error',
        result: e.message,
      }));  
    }
  });
  
  api.erc20.get_transactions = async (contractId, address) => {
    if (api.erc20.contracts[contractId] != null) {
      return await api.erc20.contracts[
        contractId
      ].interface.EtherscanProvider.getHistory(
        address,
        null,
        null,
        contractId
      );
    } else {
      throw new Error(`Cannot get transaction list for inactive coin ${contractId}`)
    }
  };

  api.erc20.get_standardized_wallet_transactions = async (contractId) => {
    if (api.erc20.contracts[contractId] != null) {
      if (api.erc20.wallet != null) {
        let processedTxs = standardizeEthTxObj(
          await api.erc20.get_transactions(contractId, api.erc20.wallet.address),
          api.erc20.wallet.address,
          api.erc20.contracts[contractId].decimals
        );

        for (let i = 0; i < processedTxs.length; i++) {
          let tx = processedTxs[i];

          if (tx.type === "self") {
            const txReceipt = await api.erc20.get_transaction(
              contractId,
              tx.txid
            );
            const fee = ethers.utils
              .formatEther(
                txReceipt.gasUsed.mul(ethers.utils.parseEther(tx.gasPrice))
              )
              .toString();

            processedTxs[i] = { ...tx, ...txReceipt, amount: fee, fee };
          }
        }

        return processedTxs;
      } else {
        throw new Error(
          `No wallet authenticated, cannot get wallet transactions for ${contractId}`
        );
      }
    } else {
      throw new Error(
        `Cannot get transaction list for inactive coin ${contractId}`
      );
    }
  };

  api.erc20.get_transaction = async (contractId, txid) => {
    if (api.erc20.contracts[contractId] != null) {
      const txReceipt = await api.erc20.contracts[
        contractId
      ].interface.DefaultProvider.getTransactionReceipt(txid);

      return txReceipt
    } else {
      throw new Error(`Cannot get transaction for inactive coin ${contractId}`)
    }
  }

  return api;
};