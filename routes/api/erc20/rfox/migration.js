const ethers = require('ethers');
const RFOX_UTILITY_ABI = require('./abi');
const RFOX_UTILITY_CONTRACT = "0xD82F7e3956d3FF391C927Cd7d0A7A57C360DF5b9"

module.exports = (api) => {  
  api.erc20.rfox = {}

  api.setGet('/erc20/rfox/estimate_gas_claim_account_balances', async (req, res, next) => {
    try {
      res.send(JSON.stringify({
        msg: 'success',
        result: await api.erc20.rfox.estimateGasClaimAccountBalances()
      })); 
    } catch (e) {
      res.send(JSON.stringify({
        msg: 'error',
        result: e.message
      })); 
    }
  });

  api.setGet('/erc20/rfox/get_account_balances', async (req, res, next) => {
    try {
      res.send(JSON.stringify({
        msg: 'success',
        result: await api.erc20.rfox.getAccountBalances()
      })); 
    } catch (e) {
      res.send(JSON.stringify({
        msg: 'error',
        result: e.message
      })); 
    }
  });

  api.setPost('/erc20/rfox/claim_account_balances', async (req, res, next) => {
    try {
      res.send(JSON.stringify({
        msg: 'success',
        result: await api.erc20.rfox.claimAccountBalances()
      })); 
    } catch (e) {
      res.send(JSON.stringify({
        msg: 'error',
        result: e.message
      })); 
    }
  });

  /**
   * Estimates the gas required to claim the account balance of an RFOX account
   */
  api.erc20.rfox.estimateGasClaimAccountBalances = async () => {
    const contractId = '0xa1d6Df714F91DeBF4e0802A542E13067f31b8262'

    if (api.erc20.contracts[contractId] == null) {
      throw new Error(
        `No interface to connect to estimateGasClaimAccountBalances`
      );
    } else if (api.erc20.wallet == null) {
      throw new Error(
        "No ERC20 wallet authenticated to use for estimateGasClaimAccountBalances"
      );
    }

    const web3Provider = api.erc20.contracts[contractId]
    const contract = web3Provider.interface.getContract(RFOX_UTILITY_CONTRACT, RFOX_UTILITY_ABI)
    const signer = new ethers.VoidSigner(api.erc20.wallet.address, web3Provider.interface.DefaultProvider)
    const uncompressedPubKey = api.erc20.wallet.pub

    const x = Buffer.from(uncompressedPubKey.slice(4, 68), 'hex')
    const y = Buffer.from(uncompressedPubKey.slice(68), 'hex')

    return (await contract
      .connect(signer)
      .estimateGas.withdrawBalance(x, y)).mul(
      await web3Provider.interface.DefaultProvider.getGasPrice()
    );
  }

  /**
   * Claims claimable account balance of a RedFOX account
   */
  api.erc20.rfox.claimAccountBalances = async () => {
    const contractId = '0xa1d6Df714F91DeBF4e0802A542E13067f31b8262'
    
    if (api.erc20.contracts[contractId] == null) {
      throw new Error(
        `No interface to connect to estimateGasClaimAccountBalances`
      );
    } else if (api.erc20.wallet == null) {
      throw new Error(
        "No ERC20 wallet authenticated to use for estimateGasClaimAccountBalances"
      );
    }

    const web3Provider = api.erc20.contracts[contractId]
    const contract = web3Provider.interface.getContract(RFOX_UTILITY_CONTRACT, RFOX_UTILITY_ABI)
    const signableContract = contract.connect(
      new ethers.Wallet(
        ethers.utils.hexlify(api.erc20.wallet.signer.signingKey.privateKey),
        web3Provider.interface.DefaultProvider
      )
    );
    const uncompressedPubKey = api.erc20.wallet.pub

    const x = Buffer.from(uncompressedPubKey.slice(4, 68), 'hex')
    const y = Buffer.from(uncompressedPubKey.slice(68), 'hex')
  
    return await signableContract.withdrawBalance(x, y)
  }

  /**
   * Gets total account balance of a RedFOX account
   */
  api.erc20.rfox.getAccountBalances = async () => {
    const contractId = '0xa1d6Df714F91DeBF4e0802A542E13067f31b8262'

    if (api.erc20.contracts[contractId] == null) {
      throw new Error(
        `No interface to connect to getAccountBalances`
      );
    } else if (api.erc20.wallet == null) {
      throw new Error(
        "No ERC20 wallet authenticated to use for getAccountBalances"
      );
    }

    const web3Provider = api.erc20.contracts[contractId]
    const contract = web3Provider.interface.getContract(
      RFOX_UTILITY_CONTRACT,
      RFOX_UTILITY_ABI
    );
    const uncompressedPubKey = api.erc20.wallet.pub

    const x = Buffer.from(uncompressedPubKey.slice(4, 68), 'hex')
    const y = Buffer.from(uncompressedPubKey.slice(68), 'hex')

    return await contract.totalAccountBalance(x, y)
  }

  return api;
};