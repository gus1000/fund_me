
//fund me contract comes with a provider object 
const { assert, expect } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
// we needed to compare the starting balances with the ending balances

//chai is an asserion library

developmentChains.includes(network.name)



describe("FundMe",  async function () {
    let fundMe
    let deployer
    let mockV3Aggregator
    const sendValue = ethers.utils.parseEther("1")


    beforeEach( async function () {
        //deploy our fundMe contract
        // using Hardhat - deploy // if it default networ, you will get 10 fake accounts to work with 
        //const accounts = await ethers.getSigners()
        //const accountsOne =  accounts [0]
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])

         // returns whatever is in the account section...the provate key
        // we can deploy everything in our deploy folder with hist this one line
        fundMe = await ethers.getContract("FundMe", deployer) // most recent deployment of whatever contract we tell it
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer)


    })

    describe("constructor", async function () {
        it("sets the aggregator address correctly " , async function() {
            const response = await fundMe.getPriceFeed()
            assert.equal(response, mockV3Aggregator.address)
        })
    })
    describe("fund", function () {
            // https://ethereum-waffle.readthedocs.io/en/latest/matchers.html
            // could also do assert.fail
        it("Fails if you don't send enough ETH", async function () {
            await expect(fundMe.fund()).to.be.revertedWith(
                "You need to spend more ETH!"
            )
        }) // why does this work 
        it("Updates the amount funded data structure", async function ()  {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.getAddressToAmountFunded(
                deployer
            )
            assert.equal(response.toString(), sendValue.toString())
        })
        it("Adds funder to array of funders", async function(){
            await fundMe.fund({value: sendValue}) //at index 0 
            const funder = await fundMe.getFunder(0)
            assert.equal(funder, deployer)



        })

    

    

    
    })


    describe("withdraw", async function() {
        beforeEach(async function (){

            await fundMe.fund({value: sendValue})
        })

        it("Withdraw ETH from a single founder", async function() {
       //arrange

        const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
        const startingDeployerBalance = await fundMe.provider.getBalance(deployer)

        //act
        const transactionResponse = await fundMe.withdraw()
        const transactionReceipt = await transactionResponse.wait(1)
        const { gasUsed, effectiveGasPrice} = transactionReceipt
        const gasCost = gasUsed.mul(effectiveGasPrice)

        const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)

        const endingDeployerBalance = await fundMe.provider.getBalance(deployer)
            //since fund me is coonected with deployer, the deployer is the one claling the  transactiobs
        //assert...if you don't include gas, you will get a failed test indicating the two blances ar not equal
        assert.equal(endingFundMeBalance , 0) // we withdrew all the money from endingfundme balance
        assert.equal(startingFundMeBalance.add(startingDeployerBalance).toString(), endingDeployerBalance.add(gasCost).toString())
        })
        it("Withdraw Eth from a singleFounder ", async function() {
            //arrange
     
             const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
             const startingDeployerBalance = await fundMe.provider.getBalance(deployer)
     
             //act
             const transactionResponse = await fundMe.cheaperWithdraw()
             const transactionReceipt = await transactionResponse.wait(1)
             const { gasUsed, effectiveGasPrice} = transactionReceipt
             const gasCost = gasUsed.mul(effectiveGasPrice)
     
             const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
     
             const endingDeployerBalance = await fundMe.provider.getBalance(deployer)
                 //since fund me is coonected with deployer, the deployer is the one claling the  transactiobs
             //assert...if you don't include gas, you will get a failed test indicating the two blances ar not equal
             assert.equal(endingFundMeBalance , 0) // we withdrew all the money from endingfundme balance
             assert.equal(startingFundMeBalance.add(startingDeployerBalance).toString(), endingDeployerBalance.add(gasCost).toString())
             })












        it("allows us to withdraw with multiple funders", async function (){
            //Arrange
            const accounts = await ethers.getSigners()
            for (let i = 1; i < 6; i++) {
                const fundMeConnectedContract = await fundMe.connect(
                    accounts[i]
                )
                await fundMeConnectedContract.fund({ value: sendValue})
                

            }
            const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
            const startingDeployerBalance = await fundMe.provider.getBalance(deployer)
            //act



            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            const { gasUsed, effectiveGasPrice} = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)




            //assert

            const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)

            const endingDeployerBalance = await fundMe.provider.getBalance(deployer)
            //since fund me is coonected with deployer, the deployer is the one claling the  transactiobs
            //assert...if you don't include gas, you will get a failed test indicating the two blances ar not equal
            assert.equal(endingFundMeBalance , 0) // we withdrew all the money from endingfundme balance
            assert.equal(startingFundMeBalance.add(startingDeployerBalance).toString(), endingDeployerBalance.add(gasCost).toString())


            //make sure the funder are reset propertly 
            await expect(fundMe.getFunder(0)).to.be.reverted
            for ( i = 1; i < 6 ; i++) {
                assert.equal(
                    await fundMe.getAddressToAmountFunded(accounts[i].address), 0
                )
            }


        })
        it("Only allows the owner to withdraw", async function () {
            const accounts = await  ethers.getSigners()
            const attacker = accounts[1]
            const attackerConnectedContract = await fundMe.connect(attacker)
            await expect(attackerConnectedContract.withdraw()).to.be.revertedWith("FundMe__NotOwner")




        })
        ////////////////////////////////////////////////////////////////////////////

        it("cheaperWithdraw", async function (){
            //Arrange
            const accounts = await ethers.getSigners()
            for (let i = 1; i < 6; i++) {
                const fundMeConnectedContract = await fundMe.connect(
                    accounts[i]
                )
                await fundMeConnectedContract.fund({ value: sendValue})
                

            }
            const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
            const startingDeployerBalance = await fundMe.provider.getBalance(deployer)
            //act



            const transactionResponse = await fundMe.cheaperWithdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            const { gasUsed, effectiveGasPrice} = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)




            //assert

            const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)

            const endingDeployerBalance = await fundMe.provider.getBalance(deployer)
            //since fund me is coonected with deployer, the deployer is the one claling the  transactiobs
            //assert...if you don't include gas, you will get a failed test indicating the two blances ar not equal
            assert.equal(endingFundMeBalance , 0) // we withdrew all the money from endingfundme balance
            assert.equal(startingFundMeBalance.add(startingDeployerBalance).toString(), endingDeployerBalance.add(gasCost).toString())


            //make sure the funder are reset propertly 
            await expect(fundMe.getFunder(0)).to.be.reverted
            for ( i = 1; i < 6 ; i++) {
                assert.equal(
                    await fundMe.getAddressToAmountFunded(accounts[i].address), 0
                )
            }


        })






        

        
    })

    
})// loading in the cheaper withdrawls requires the extra step of loading them all in