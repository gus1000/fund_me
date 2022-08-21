require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter")
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()
require("solidity-coverage")
require("hardhat-deploy")
require("@nomiclabs/hardhat-ethers")

// You need to export an object to set up your config 
// Go to https://hardhat.org/config/ to learn more
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ""
const RINKEBY_RPC_URL =
  process.env.RINKEBY_RPC_URL ||
  "https://eth-rinkeby.alchemyapi.io/v2/tTZoSXf-p1efFVB0r0wRsVU_6p2u-FIh"
const PRIVATE_KEY =
  process.env.PRIVATE_KEY ||
  "1bbfeabe6027b0d3164afa0241a68f41bdde38cd4ddd4e7e8b7c31d2b52d87a9"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""
//wh
module.exports = {
  solidity: "0.8.8" , 
  defaultNetwork: "hardhat",
  networks: {
      hardhat: {
          chainId: 31337,
          // gasPrice: 130000000000,
      },
      rinkeby: {
          url: RINKEBY_RPC_URL,
          accounts: [PRIVATE_KEY],
          chainId: 4,
          blockConfirmations: 6, // we want to give etherscan a chance to index our transaciton during those 6 block confirmations
      },
  },
  solidity: {
      compilers: [
          {
              version: "0.8.8",
          },
          {
              version: "0.6.6",
          },
      ],
  },
  etherscan: {
      apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
      enabled: true,
      currency: "USD",
      outputFile: "gas-report.txt",
      noColors: true,
      coinmarketcap: COINMARKETCAP_API_KEY,
      token: "ETH"
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
    },
}
//mocking is creating objects that simulate the behavior of real objects
// when going for local host, we want to use mocks

//Mocks are used to isolate behavior of an object you want to replace other objects with mocks
// we want to create a fake price feed on our loxal macjone 