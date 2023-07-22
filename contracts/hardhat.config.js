require("@nomicfoundation/hardhat-toolbox");
/** @type import('hardhat/config').HardhatUserConfig */
require("@truffle/dashboard-hardhat-plugin");

module.exports = {
  solidity: "0.8.16",

  networks: {
    truffledashboard: {
      url: "http://localhost:24012/rpc"
    },
    goerli: {
      url: `https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161`,
      accounts: [""],
    },
  },
  etherscan: {
    apiKey: "",
  },
};
