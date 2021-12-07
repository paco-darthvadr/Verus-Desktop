const { GetOffersRequest, GetOffersResponse } = require("verus-typescript-primitives");

module.exports = (api) => {  
  api.native.getoffers = async (request, formattedIdentities, openOffers) => {
    const response = new GetOffersResponse(await api.native.callDaemon(...request.prepare()));

    // Remove when offer ownership becomes part of getoffers
    const ownOffers =
      openOffers == null
        ? await api.native.callDaemon(request.chain, "listopenoffers", [])
        : openOffers;

    const ownIdentities =
      formattedIdentities == null
        ? await api.native.get_identities(request.chain)
        : formattedIdentities;

    //Replace i-addresses with currency names
    await Promise.all(
      Object.keys(response.result).map(async (offercategory) => {
        await Promise.all(
          response.result[offercategory].map(async (offer, index) => {
            const txid = response.result[offercategory][index].offer.txid
            response.result[offercategory][index].cantake = true
            response.result[offercategory][index].canclose = false

            if (ownOffers != null && ownOffers.find(x => x.txid === txid) != null) {
              response.result[offercategory][index].canclose = true
            }

            await Promise.all(
              Object.keys(response.result[offercategory][index].offer).map(async (key) => {
                if (key === "accept" && response.result[offercategory][index].offer[key].name != null) {
                  if (ownIdentities == null || ownIdentities.find(
                    (x) =>
                      x.identity.identityaddress ===
                        response.result[offercategory][index].offer[key].identityid &&
                      x.canwriterecovery &&
                      x.canwriterevocation && 
                      x.canspendfor &&
                      x.cansignfor
                  ) == null) {
                    response.result[offercategory][index].cantake = false
                  }
                } else if (
                  (key === "accept" || key === "offer") &&
                  response.result[offercategory][index].offer[key].name == null
                ) {
                  await Promise.all(
                    Object.keys(response.result[offercategory][index].offer[key]).map(
                      async (currencyid) => {
                        const name =
                          currencyid === "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV"
                            ? "VRSC"
                            : currencyid === "iJhCezBExJHvtyH3fGhNnt2NhU4Ztkf2yq"
                            ? "VRSCTEST"
                            : (await api.native.get_currency_definition(request.chain, currencyid))
                                .name;

                        if (name !== currencyid) {
                          response.result[offercategory][index].offer[key][name] =
                            response.result[offercategory][index].offer[key][currencyid];
                          delete response.result[offercategory][index].offer[key][currencyid];
                        }
                      }
                    )
                  );
                }
              })
            );
          })
        );
      })
    );

    return response.toJson();
  }

  api.setPost('/native/getoffers', async (req, res, next) => {
    try {
      res.send(
        JSON.stringify({
          msg: "success",
          result: new GetOffersResponse(
            await api.native.getoffers(GetOffersRequest.fromJson(req.body))
          ).toJson(),
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