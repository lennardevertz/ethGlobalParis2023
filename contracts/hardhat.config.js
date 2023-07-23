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
      url: `https://goerli.infura.io/v3/`,
      accounts: [""],
    },
    gnosis: {
      url: "https://rpc.gnosischain.com",
      accounts: [""],
    },
  },
  etherscan: {
    customChains: [
      {
        network: "gnosis",
        chainId: 100,
        urls: {
          // 3) Select to what explorer verify the contracts
          // Gnosisscan
          apiURL: "https://api.gnosisscan.io/api",
          browserURL: "https://gnosisscan.io/",
          // Blockscout
          //apiURL: "https://blockscout.com/xdai/mainnet/api",
          //browserURL: "https://blockscout.com/xdai/mainnet",
        },
      },
    ],
    apiKey: {
      //4) Insert your Gnosisscan API key
      //blockscout explorer verification does not require keys
      gnosis: "",
    },
  },
};
