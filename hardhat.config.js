require("@nomicfoundation/hardhat-toolbox");
require("@chainlink/env-enc").config()

const url1 = process.env.SEPOLIA_URL
const accounts1 = process.env.AMOUNT
const apiKey = process.env.APIKEY
const accounts2 = process.env.AMOUNTSECOND

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
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
    apiKey: apiKey
  }
            
};
