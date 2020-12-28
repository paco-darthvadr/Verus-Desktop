const { SECRETS, SECRETS_DESC } = require('../utils/constants/index')

module.exports = (api) => {
  api.loadSecrets = () => api.loadJsonFile(SECRETS, SECRETS_DESC, 0o600);
  api.saveSecrets = (secrets) => api.saveJsonFile(secrets, SECRETS, SECRETS_DESC, 0o600);

  return api;
};