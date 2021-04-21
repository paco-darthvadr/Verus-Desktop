module.exports = (api) => {
  api.native.restartCoin = async (chainTicker, launchConfig, startupOptions, bootstrap = false) => {
    api.log('initiating restart for ' + chainTicker, 'restartCoin')

    await api.quitDaemon(chainTicker === 'KMD' ? 'komodod' : chainTicker, 30000)

    return new Promise((resolve, reject) => {
      const intervalId = setInterval(async () => {
        api.log('checking if ' + launchConfig.daemon + " process has finished", 'restartCoin')
        let tries = 0

        const resolveInterval = async () => {
          clearInterval(intervalId)
          try {
            resolve(await api.native.addCoin(chainTicker, launchConfig, startupOptions, bootstrap))
          } catch(e) {
            reject(e)
          }
        }
  
        if (!(await api.isDaemonRunning(launchConfig.daemon))) {
          api.log(`${launchConfig.daemon} no longer running, starting ${launchConfig.daemon}`, 'restartCoin')
          await resolveInterval()
        } else if (tries >= 20) {
          api.log(`${tries * 2} seconds have passed, trying to launch daemon anyways`, 'restartCoin')
          await resolveInterval()
        } else tries++
      }, 1000)
    })
  }

  api.setPost('/native/coins/restart', (req, res) => {
    const { chainTicker, launchConfig, startupOptions, bootstrap } = req.body
    
    api.native.restartCoin(chainTicker, launchConfig, startupOptions, bootstrap)
    .then(result => {
      res.send(JSON.stringify({
        msg: 'success',
        result,
      }));
    })
    .catch(e => {
      const retObj = {
        msg: "error",
        result: e.message,
      };

      res.send(JSON.stringify(retObj));
    })
  });

  return api;
};