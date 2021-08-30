module.exports = (api) => {  
  api.setGet('/erc20/get_info', (req, res, next) => {
    let retObj = {}
    
    try {
      const { network, address, decimals } = api.erc20.get_info(
        req.query.chainTicker
      );

      retObj = {
        msg: 'success',
        result: {
          network: network.key,
          chainId: network.id,
          contract: address,
          decimals,
        }
      }
    } catch (e) {
      retObj = {
        msg: 'error',
        result: e.message
      }
    }
    
    res.send(JSON.stringify(retObj));  
  });

  api.erc20.get_info = (contractId) => {
    if (api.erc20.contracts[contractId] != null) {
      return {
        ...api.erc20.contracts[contractId].interface.getInfo(),
        address: contractId,
        decimals:
          api.erc20.contracts[contractId].decimals != null
            ? api.erc20.contracts[contractId].decimals.toString()
            : "18",
      };
    } else {
      throw new Error(`No interface to connect to ${contractId} for getinfo call`)
    }
  }

  return api;
};