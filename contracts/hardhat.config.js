require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: [
        // Add your private key here (get from MetaMask)
        process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000"
      ],
      chainId: 43113,
      gasPrice: 30000000000, // 30 gwei
      gas: 3000000
    },
    hardhat: {
      chainId: 31337
    }
  },
  paths: {
    sources: "./contracts",
    artifacts: "./artifacts",
    cache: "./cache"
  }
};