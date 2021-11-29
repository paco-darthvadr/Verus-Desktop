module.exports = (api) => {
  api.native.takeoffer = async ({
    chain,
    fromaddress,
    offer: { txid, changeaddress, deliver, accept },
  }) => {
    return await api.native.callDaemon(chain, "takeoffer", [
      fromaddress,
      { txid, changeaddress, deliver, accept },
    ]);
  };

  api.setPost("/native/takeoffer", async (req, res, next) => {
    try {
      res.send(
        JSON.stringify({
          msg: "success",
          result: await api.native.takeoffer({
            chain: req.body.chain,
            fromaddress: req.body.fromaddress,
            offer: req.body.offer,
          }),
        })
      );
    } catch (e) {
      res.send(
        JSON.stringify({
          msg: "error",
          result: e.message,
        })
      );
    }
  });

  return api;
};
