// https://eth-ropsten.alchemyapi.io/v2/V_q-TBivuUCIc3gHH5IAlFHXLrGo5dJx

require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  defaultNetwork: "local",
  networks: {
    ropsten: {
      url: 'https://eth-ropsten.alchemyapi.io/v2/V_q-TBivuUCIc3gHH5IAlFHXLrGo5dJx',
      accounts: ['addcc4b856023501c13014a733f2b4b0fbe42bd8cede30b77ea3c973f7b5070a']
    },
    local: {
      url: "http://127.0.0.1:7545",
    }
  }
}