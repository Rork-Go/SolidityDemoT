const {ethers} = require("hardhat")
const {assert} = require("chai")

describe("fundme test contract",async function() {

    it("test oner  function",async function(){
        const [firstAccount] = await ethers.getSigners()
        const fundMeFactory =await ethers.getContractFactory("fundme")
        const fundme = await fundMeFactory.deploy(300)
        await fundme.waitForDeployment()
        assert.equal(await fundme.oner(), firstAccount.address)


    })




})