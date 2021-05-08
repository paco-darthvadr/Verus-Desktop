module.exports = (api) => {  
  api.setGet('/eth/get_info', (req, res, next) => {
    let retObj = {}
    
    try {
      const { network } = api.eth.get_info()

      retObj = {
        msg: 'success',
        result: {
          network: network.key,
          chainId: network.id
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

  api.eth.get_info = () => {
    if (api.eth.interface != null) {
      return api.eth.interface.getInfo()
    } else {
      throw new Error('No interface to connect to ETH for getinfo call')
    }
  }

  return api;
};