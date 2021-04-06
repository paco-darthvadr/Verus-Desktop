const { ETH_HOMESTEAD } = require('../utils/constants/eth_networks');
const createInterface = require('../utils/web3/provider');

module.exports = (api) => {  
  api.setPost('/eth/coins/activate', (req, res, next) => {
    const { chainTicker, network } = req.body;
  
    try {
      if (chainTicker && chainTicker === 'ETH') {
        if (api.eth.interface == null) {
          api.eth.interface = createInterface(
            network == null ? ETH_HOMESTEAD : network
          );
  
          const retObj = {
            msg: 'success',
            result: 'true',
          };
          res.send(JSON.stringify(retObj));
        } else {
          const retObj = {
            msg: 'error',
            result: 'ETH already active!',
          };
          res.send(JSON.stringify(retObj));
        }
      } else {
        const retObj = {
          msg: 'error',
          result: 'cannot activate non-eth coin on ETH network',
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

  api.setPost('/eth/remove_coin', (req, res) => {
    api.eth.interface = null

    const retObj = {
      msg: 'success',
      result: true,
    };

    res.send(JSON.stringify(retObj));
  });

  return api; 
};