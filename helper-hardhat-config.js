const networkConfig = {
    31337: {
        name: "localhost",
    },
    // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
    // Default one is ETH/USD contract on Kovan
    137: {
        name: "polygon",
        ethUsdPriceFeed: "0x9326BFA02ADD2366b30bacB125260Af641031331",
    },
    4: {
        name: "rinkeby",
        ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
    },
}
const developmentChains = ["hardhat", "localhost"]
const DECIMALS = 8 
const INITIAL_ANSWER = 200000000000

module.exports = {

    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER

    
}