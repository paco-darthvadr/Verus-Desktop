const {
  etherKeys,
  seedToPriv,
} = require('agama-wallet-lib/src/keys');

module.exports = (api) => {  
  api.eth._keys = (seed) => {
    seed = seedToPriv(seed, 'eth');
    const signer = etherKeys(seed, true)

    return {
      address: signer.signingKey.address,
      pub: signer.signingKey.publicKey,
      signer
    }
  };

  return api;
};