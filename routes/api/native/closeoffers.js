module.exports = (api) => {
  api.native.closeoffers = async (chain, offers = []) => {
    return await api.native.callDaemon(chain, "closeoffers", [offers]);
  };

  api.setPost("/native/closeoffers", async (req, res, next) => {
    try {
      res.send(
        JSON.stringify({
          msg: "success",
          result: await api.native.closeoffers(req.body.chain, req.body.offers),
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
