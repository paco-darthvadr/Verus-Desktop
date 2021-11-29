const { MakeOfferRequest, MakeOfferResponse } = require("verus-typescript-primitives");

module.exports = (api) => {  
  api.native.makeoffer = async (offer) => {
    return await api.native.callDaemon(...(offer.prepare()));
  }

  api.setPost('/native/makeoffer', async (req, res, next) => {
    const offer = MakeOfferRequest.fromJson(req.body)

    try {
      res.send(
        JSON.stringify({
          msg: "success",
          result: new MakeOfferResponse(await api.native.makeoffer(offer)).toJson(),
        })
      );
    } catch (e) {
      res.send(JSON.stringify({
        msg: "error",
        result: e.message
      }));
    }
  });
    
  return api;
};