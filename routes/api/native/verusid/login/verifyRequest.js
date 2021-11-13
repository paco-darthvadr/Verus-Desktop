const { Challenge } = require("../../../utils/login/Challenge");

module.exports = (api) => {
  /**
   * Verifies a login request, and returns { verified: true|false } based on
   * signature checks
   * @param {String} chain The chain to verify the login request on
   * @param {String} challenge { uuid: String, timestamp: Number, user_id_address: String }
   * @param {String} sourceId The ID making the login request, that signed the challenge
   * @param {String} signature SHA256(uuid + timestamp + user_id_address) signed by sourceId
   */
  api.native.verusid.login.verify_request = async (chain, challenge, sourceId, signature) => {
    const { uuid, timestamp, user_id_address } = challenge;
    const loginChallenge = new Challenge(uuid, timestamp, user_id_address);

    if (!loginChallenge.isValid()) {
      return { verified: false, message: "Invalid challenge" };
    }

    const verified = await api.native.verify_message(
      chain,
      sourceId,
      loginChallenge.hash(),
      signature
    );

    return verified ? { verified } : { verified, message: "Failed to verify signature" };
  };

  api.setPost("/native/verusid/login/verify_request", async (req, res, next) => {
    const { chain, challenge, source_id, signature } = req.body;

    try {
      res.send(
        JSON.stringify({
          msg: "success",
          result: await api.native.verusid.login.verify_request(
            chain,
            challenge,
            source_id,
            signature
          ),
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
