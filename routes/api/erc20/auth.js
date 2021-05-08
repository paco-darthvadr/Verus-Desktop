module.exports = (api) => {  
  api.setPost('/erc20/auth', (req, res, next) => {
    let seed = req.body.seed;

    if (!api.seed) {
      api.seed = seed;
    }

    api.erc20.wallet = api.eth._keys(seed, true);

    const retObj = {
      msg: 'success',
      result: 'success',
    };

    res.send(JSON.stringify(retObj));
  }, true);

  api.setPost('/erc20/logout', (req, res, next) => {
    api.erc20.wallet = null
    api.erc20.interface = null

    const retObj = {
      msg: 'success',
      result: 'success',
    };

    res.send(JSON.stringify(retObj));
  });

  return api; 
};
