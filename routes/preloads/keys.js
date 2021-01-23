const { randomBytes } = require('crypto');

const appSecretToken = randomBytes(32).toString('hex')
const apiShieldKey = randomBytes(32).toString('hex')

module.exports = {
  appSecretToken,
  apiShieldKey
}