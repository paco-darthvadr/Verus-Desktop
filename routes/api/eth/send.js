const ethers = require('ethers');
const { scientificToDecimal } = require('../numbers');
const Web3Interface = require('../utils/web3/web3Interface');

// speed: slow, average, fast
module.exports = (api) => {  
  /**
   * Preflights an ETH tx
   * @param {String} address 
   * @param {String} amount 
   * @param {Object} params 
   * @returns Object
   */
  api.eth.txPreflight = async (address, amount, params = {}) => {
    if (api.eth.interface == null) {
      throw new Error('No interface to connect to ETH for tx preflight call')
    } else if (api.eth.wallet == null) {
      throw new Error('No ETH wallet authenticated to use for tx preflight call')
    }

    const fromAddress = api.eth.wallet.address
    const signer = new ethers.VoidSigner(fromAddress, api.eth.interface.EtherscanProvider)
    const balance = await signer.getBalance()
    const value = ethers.utils.parseEther(scientificToDecimal(amount))

    let transaction = {}

    try {
      transaction = await signer.populateTransaction({
        to: address,
        from: fromAddress,
        value,
        chainId: api.eth.interface.network.id,
        gasLimit: ethers.BigNumber.from(21000)
      });
    } catch(e) {  
      api.log(e.message, 'eth_preflight')    
      throw new Error(Web3Interface.decodeWeb3Error(e.message).message)
    }

    if (transaction.to == null) {
      throw new Error(`"${address}" is not a valid ETH destination.`)
    }

    const maxFee = transaction.gasLimit.mul(transaction.gasPrice)
    const maxValue = maxFee.add(value)

    if (maxValue.gt(balance)) {
      const adjustedValue = value.sub(maxFee)

      if (adjustedValue.lt(ethers.BigNumber.from(0)))
        throw new Error(
          `Insufficient funds, cannot cover fee costs of at least ${maxFee} ETH.`
        );
      else
        return await api.eth.txPreflight(
          address,
          ethers.utils.formatEther(adjustedValue),
          {
            feeTakenFromAmount: true,
          }
        );
    }
    
    return {
      chainTicker: "ETH",
      to: transaction.to,
      from: transaction.from,
      balance: ethers.utils.formatEther(balance),
      value: ethers.utils.formatEther(transaction.value),
      fee: ethers.utils.formatEther(
        transaction.gasLimit.mul(transaction.gasPrice)
      ),
      total: ethers.utils.formatEther(maxValue),
      remainingBalance: ethers.utils.formatEther(balance.sub(maxValue)),
      gasPrice: ethers.utils.formatEther(transaction.gasPrice),
      gasLimit: ethers.utils.formatEther(transaction.gasLimit),
      warnings: params.feeTakenFromAmount
        ? [
            {
              field: "value",
              message: `Original amount + fee is larger than balance, amount has been changed.`,
            },
          ]
        : [],
      transaction
    };
  }

  api.eth.sendTx = async (address, amount) => {
    const preflight = await api.eth.txPreflight(address, amount)
    let { transaction } = preflight

    const signer = new ethers.Wallet(
      api.eth.wallet.signer.signingKey.privateKey,
      api.eth.interface.InfuraProvider
    );

    try {
      const response = await signer.sendTransaction(transaction);

      if (!api.eth.cache.pending_txs[response.hash]) {
        api.eth.cache.pending_txs[response.hash] = {
          hash: response.hash,
          confirmations: 0,
          from: response.from,
          gasPrice: response.gasPrice,
          gasLimit: response.gasLimit,
          to: response.to,
          value: response.value,
          nonce: response.nonce,
          data: response.data,
          chainId: response.data
        }
      }

      return {
        to: response.to,
        from: response.from,
        value: ethers.utils.formatEther(response.value),
        txid: response.hash,
        fee: ethers.utils.formatEther(
          transaction.gasLimit.mul(transaction.gasPrice)
        )
      }
    } catch(e) {
      api.log(e.message, 'eth_sendtx')
      throw new Error(Web3Interface.decodeWeb3Error(e.message).message)
    }
  }

  api.setPost('/eth/sendtx', async (req, res, next) => {
    const { toAddress, amount } = req.body

    try {
      res.send(JSON.stringify({
        msg: 'success',
        result: await api.eth.sendTx(toAddress, amount.toString()),
      }));
    } catch(e) {
      const retObj = {
        msg: 'error',
        result: e.message,
      };
      res.send(JSON.stringify(retObj));
    }
  });

  api.setPost('/eth/tx_preflight', async (req, res, next) => {
    const { toAddress, amount } = req.body

    try {
      res.send(JSON.stringify({
        msg: 'success',
        result: await api.eth.txPreflight(toAddress, amount.toString()),
      }));
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