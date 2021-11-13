const { Challenge } = require("../../../utils/login/Challenge");
const { Request } = require("../../../utils/login/Request");

module.exports = (api) => {
  /**
   * Signs a login request, and returns { signature: "" } if successful
   * @param {String} chain The chain to verify the login request on
   * @param {String} challenge { uuid: String, timestamp: Number, user_id_address: String }
   * @param {String} signature SHA256(uuid + timestamp + user_id_address) signed by sourceId
   * @param {Object} request { uuid: String, timestamp: Number, service_id_address: String }
   */
  api.native.verusid.login.sign_request = async (chain, challenge, userId, signature, request) => {
    const { uuid, timestamp, service_id_address } = request;
    const verificatonCheck = await api.native.verusid.login.verify_request(chain, challenge, service_id_address, signature)

    if (!verificatonCheck.verified) {
      throw new Error(verificatonCheck.message)
    }

    const loginRequest = new Request(uuid, timestamp, service_id_address)
    const loginChallenge = new Challenge(challenge.uuid, challenge.timestamp, challenge.user_id_address)
    const signer = loginChallenge.user_id_address

    if (signer !== "" && userId !== signer) throw new Error("Cannot sign request for different user.")

    const userSignature = await api.native.sign_message(chain, userId, loginRequest.hash());

    return { signature: userSignature, request, user: userId }
  };

  api.setPost("/native/verusid/login/sign_request", async (req, res, next) => {
    const { chain, challenge, signature, request, user_id } = req.body;

    try {
      res.send(
        JSON.stringify({
          msg: "success",
          result: await api.native.verusid.login.sign_request(
            chain,
            challenge,
            user_id,
            signature,
            request
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
