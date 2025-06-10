const {ethers, deployments} = require("hardhat")
const {assert,expect} = require("chai")
const helpers = require("@nomicfoundation/hardhat-network-helpers")

const {devlopmentChains} = require("../../helper-hardhat-config")

devlopmentChains.includes(network.name)
? describe.skip
: describe("fundme test contract",async function() {
    let fundme
    let firstAccount

    /**
     * 在每个测试用例运行之前执行的钩子函数
     * 用于设置测试环境，包括部署合约和初始化测试账户
     */
    beforeEach(async function(){
        // 部署标记为"all"的所有合约
        await deployments.fixture(["all"])
        
        // 获取命名账户，并将第一个账户赋值给firstAccount
        firstAccount = (await getNamedAccounts()).firstAccount
        
        // 获取已部署的名为"fundme"的合约信息
        const fundmedeploy = await deployments.get("fundme")
        
        // 根据"fundme"合约的地址，获取该合约的实例
        fundme = await ethers.getContractAt("fundme", fundmedeploy.address)
        
        // 打印"fundme"合约的信息
        //console.log(deployments.get("fundme"))


    })

    // test fund and getFund successfully
    it("fund and getFund successfully", 
        async function() {
            // make sure target reached
            await fundme.receiveEther({value: ethers.parseEther("0.02")}) // 2700 * 0.02 = 54
            // make sure window closed
            await new Promise(resolve => setTimeout(resolve, 200 * 1000))
            // make sure we can get receipt 
            const getFundTx = await fundme.getfundme()
            const getFundReceipt = await getFundTx.wait()
            expect(getFundReceipt)
                .to.be.emit(fundme, "FundWithdrawByOwner")
                .withArgs(ethers.parseEther("0.02"))
        }
    )
    // test fund and refund successfully
    it("fund and refund successfully",
        async function() {
            // make sure target not reached
            await fundme.receiveEther({value: ethers.parseEther("0.01")}) // 3000 * 0.1 = 300
            // make sure window closed
            await new Promise(resolve => setTimeout(resolve, 200 * 1000))
            // make sure we can get receipt 
            const refundTx = await fundme.refundme()
            const refundReceipt = await refundTx.wait()
            expect(refundReceipt)
                .to.be.emit(fundme, "RefundByFunder")
                .withArgs(firstAccount, ethers.parseEther("0.01"))
        }
    )

    











})
