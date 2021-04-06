const Web3Interface = require('./web3Interface')
const { ETHERSCAN_API_KEY } = require('../../../../keys/etherscan')
const { INFURA_PROJECT_ID } = require('../../../../keys/infura')

const createInterface = (network) => {
  return new Web3Interface(network, {
    etherscan: ETHERSCAN_API_KEY,
    infura: INFURA_PROJECT_ID
  })
}

module.exports = createInterface