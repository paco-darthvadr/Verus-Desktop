const ethers = require('ethers-michaeltout')

class Web3Interface {
  constructor(network, apiKeys) {
    this.network = network;
    this.keys = apiKeys

    this.DefaultProvider = new ethers.getDefaultProvider(
      this.network.key,
      apiKeys
    );

    this.EtherscanProvider = new ethers.providers.EtherscanProvider(
      this.network.key,
      apiKeys.etherscan
    );
  }

  initContract = async (contractAddress) => {   
    try {
      const abi = await this.EtherscanProvider.perform("getabi", {
        address: contractAddress,
      });

      return [contractAddress, abi]
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  getContract = (contractAddress, abi) => {
    return new ethers.Contract(contractAddress, abi, this.DefaultProvider)
  };

  getInfo = () => {
    return{ 
      network: this.network
    }
  }
}

module.exports = Web3Interface