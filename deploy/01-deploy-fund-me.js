//import
// main funtion
// calling of main function 

//when going for local host or hardhat network we want to use a mock network 

// function deployFunc(hre) { //we will export this function

//     console.log("Hi")

//
//this is an async nameless function  and anonymous 

const { getNamedAccounts, deployments, network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ( { getNamedAccounts, deployments}) => {
    const {deploy, log } = deployments  // these are functions
    const {deployer} = await getNamedAccounts()
    const chainId = network.config.chainId

// //const { networkconfig} = require (" ../helper-hardhat-config")
// //const helperConfig = require( "../helper-hardhat-config")
// const {networkConfig, developmentChains} = require( "../helper-hardhat-config")
// const {network, deployments} = require("hardhat") //this network config is cmong fro mahrdhat 
// const { verify } = require("../utils/verify")


let ethUsdPriceFeedAddress  // use let so we can update it



//const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]

     if (chainId == 31337) {
         const ethUsdAggregator = await deployments.get("MockV3Aggregator")
         ethUsdPriceFeedAddress = ethUsdAggregator.address


     } else {
         ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
     } 


    // log("----------------------------------------------------")
    // log("Deploying FundMe and waiting for confirmations...")






        // if chainId is X use address Y 
        // if chainid is z use address a


        // we need to parameterize, not hardcode...\
        //what happens when we want to change chains
        // when going for local host or hardhet network we want  to use a mock
        // we are deploying the contract 

        
        //you have to configire the price feed into the network on a  script
        
        
        
    const fundMe = await deploy("FundMe", {

        from: deployer,
        args: [ethUsdPriceFeedAddress] ,// put price feed address
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    // log(`FundMe deployed at ${fundMe.address}`)


     if (
         !developmentChains.includes(network.name) && 
         process.env.ETHERSCAN_API_KEY
     )  { // is the name of the network a development chain
         //verify
         await verify(fundMe.address, [ethUsdPriceFeedAddress])
        
     }
     //if the contract doesn't exist, we deploy a minimal version
     //for our local testing 
     //deploy mocks are similar to a deplpy script 

}
module.exports.tags = ["all", "fundme"]

// module.exports.default = deployFunc



//HRE is an object containog all the functionality that hardhat expoes when runninga tasj, test, script 