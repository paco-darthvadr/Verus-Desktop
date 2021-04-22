const ethers = require('ethers-michaeltout')

class Web3Interface {
  constructor(network, apiKeys) {
    this.network = network;
    this.keys = apiKeys;

    this.DefaultProvider = new ethers.getDefaultProvider(
      this.network.key,
      apiKeys
    );

    this.EtherscanProvider = new ethers.providers.EtherscanProvider(
      this.network.key,
      apiKeys.etherscan
    );

    this.InfuraProvider = new ethers.providers.InfuraProvider(
      this.network.key,
      apiKeys.infura
    );
  }

  static decodeWeb3Error(errorString) {
    try {
      let errorJsonString = "{";
      let index = errorString.indexOf("error={") + 7;
      let openers = 1;
      let closers = 0;

      while (openers != closers && index < errorString.length) {
        errorJsonString = errorJsonString + errorString[index];

        if (errorString[index] === "{") openers++;
        else if (errorString[index] === "}") closers++;

        index++;
      }

      const errorObject = JSON.parse(JSON.parse(errorJsonString).body).error;
      return {
        code: errorObject.code,
        message:
          errorObject.message.charAt(0).toUpperCase() +
          errorObject.message.slice(1),
      };
    } catch (e) {            
      return {
        code: -32000,
        message: "Unknown error",
      };
    }
  }

  initContract = async (contractAddress) => {
    try {
      const abi = await this.EtherscanProvider.perform("getabi", {
        address: contractAddress,
      });

      return [contractAddress, abi];
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  getContract = (contractAddress, abi) => {
    return new ethers.Contract(contractAddress, abi, this.DefaultProvider);
  };

  getInfo = () => {
    return {
      network: this.network,
    };
  };
}

module.exports = Web3Interface