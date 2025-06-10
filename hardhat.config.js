require("@nomicfoundation/hardhat-toolbox");
require("@chainlink/env-enc").config()
require("./tasks")
require("hardhat-deploy")
require("@nomicfoundation/hardhat-ethers");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
require("hardhat-gas-reporter");



const url1 = process.env.SEPOLIA_URL
const accounts1 = process.env.AMOUNT
const apiKey = process.env.APIKEY
const accounts2 = process.env.AMOUNTSECOND

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  gasReporter: {
  enabled: true,
  currency: 'USD',
  gasPrice: 21, // 单位是 gwei
  // 可选字段（用于显示更准确的 USD 成本）
  coinmarketcap: process.env.CMC_API_KEY, // 如果你有 CoinMarketCap API Key 的话
  },
  defaultNetwork: "hardhat",
  solidity: "0.8.28",
  mocha: {
    timeout: 300000,
  },
  networks: {
    sepolia: {
      url: url1,
      accounts: [accounts1,accounts2],
      chainId: 11155111,
    }
  
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: {
      sepolia: apiKey
    }
  },

  namedAccounts: {
    firstAccount: {
      default: 0,
    },
    secondAccount: {
      default: 1,

    }

  }


            
};
