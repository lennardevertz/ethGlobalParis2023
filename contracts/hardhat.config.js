require("@nomicfoundation/hardhat-toolbox");
/** @type import('hardhat/config').HardhatUserConfig */
require("@truffle/dashboard-hardhat-plugin");
const ETHERSCAN_API_KEY="KEY"

module.exports = {
  solidity: "0.8.16",

  networks: {
    truffledashboard: {
      url: "http://localhost:24012/rpc",
    },
  },
};
