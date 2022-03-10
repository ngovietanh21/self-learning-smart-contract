require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: '0.5.16',
  defaultNetwork: "local",
  networks: {
    local: {
      url: "http://127.0.0.1:8545",
    }
  }
}