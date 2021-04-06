const { ETH_HOMESTEAD, ETH_ROPSTEN } = require('../utils/constants/eth_networks');
const createInterface = require('../utils/web3/provider');
const ethers = require('ethers')

module.exports = (api) => {  
  api.setPost('/erc20/coins/activate', async (req, res, next) => {
    // chainTicker represents contract ID
    const { chainTicker, network } = req.body;

    try {
      if (chainTicker) {
        if (api.erc20.contracts[chainTicker] == null) {
          const interface = createInterface(
            network == null ? ETH_ROPSTEN : network
          );
          const contractData = await interface.initContract(chainTicker)

          const contract = interface.getContract(...contractData)
  
          api.erc20.contracts[chainTicker] = {
            interface,
            contract,
            decimals: contract.decimals != null
              ? await contract.decimals()
              : ethers.BigNumber.from("18"),
            symbol: await contract.symbol(),
          };
  
          const retObj = {
            msg: 'success',
            result: 'true',
          };
          res.send(JSON.stringify(retObj));
        } else {
          const retObj = {
            msg: 'error',
            result: `${chainTicker} already active!`,
          };
          res.send(JSON.stringify(retObj));
        }
      } else {
        const retObj = {
          msg: 'error',
          result: 'no contract id provided to activate',
        };
        res.send(JSON.stringify(retObj));
      }
    } catch(e) {
      const retObj = {
        msg: 'error',
        result: e.message,
      };
      res.send(JSON.stringify(retObj));
    }
  });

  api.setPost('/erc20/remove_coin', (req, res) => {
    api.erc20.contracts[req.body.chainTicker] = null

    const retObj = {
      msg: 'success',
      result: true,
    };

    res.send(JSON.stringify(retObj));
  });

  return api; 
};