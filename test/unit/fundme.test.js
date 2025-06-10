const {ethers, deployments} = require("hardhat")
const {assert,expect} = require("chai")
const helpers = require("@nomicfoundation/hardhat-network-helpers")
const {devlopmentChains} = require("../../helper-hardhat-config")
require("hardhat-gas-reporter");

!devlopmentChains.includes(network.name)
? describe.skip
: describe("fundme test contract",async function() {
    let fundme
    let firstAccount
    let mockV3Aggregator
    let fundMeSecondAccount
    let secondAccount

    /**
     * 在每个测试用例运行之前执行的钩子函数
     * 用于设置测试环境，包括部署合约和初始化测试账户
     */
    beforeEach(async function(){
        // 部署标记为"all"的所有合约
        await deployments.fixture(["all"])
        
        // 获取命名账户，并将第一个账户赋值给firstAccount
        firstAccount = (await getNamedAccounts()).firstAccount
        secondAccount = (await getNamedAccounts()).secondAccount
        
        // 获取已部署的名为"fundme"的合约信息
        const fundmedeploy = await deployments.get("fundme")

        mockV3Aggregator = await deployments.get("MockV3Aggregator")
        
        // 根据"fundme"合约的地址，获取该合约的实例
        fundme = await ethers.getContractAt("fundme", fundmedeploy.address)
        
        // 打印"fundme"合约的信息
        //console.log(deployments.get("fundme"))

        fundMeSecondAccount = await ethers.getContract("fundme", secondAccount)


    })

    it("test oner  function",async function(){
        // const [firstAccount] = await ethers.getSigners()
        // const fundMeFactory =await ethers.getContractFactory("fundme")
        // const fundme = await fundMeFactory.deploy(300)
        await fundme.waitForDeployment()
        assert.equal((await fundme.oner()), firstAccount)
        //console.log(fundme)


    })

    it("test dataFeed  function",async function(){
        // const fundMeFactory =await ethers.getContractFactory("fundme")
        // const fundme = await fundMeFactory.deploy(300)
               // 等待fundme合约部署完成
        await fundme.waitForDeployment()
        assert.equal(await fundme.dataFeed(), mockV3Aggregator.address)


    })

        //fund
        // 测试用例：窗口关闭后，发送的以太币价值大于最低要求，但资助失败
    it("window closed, value grater than minimum, fund failed", 
        async function() {
            // 确保资助窗口已关闭（通过增加200秒时间）
            await helpers.time.increase(200)
            await helpers.mine()
            //console.log("Current timestamp:", (await ethers.provider.getBlock('latest')).timestamp)
            // 发送0.1 ETH到receiveEther函数，期望交易被拒绝，并提示"No bucheng"
            expect(fundme.receiveEther({value: ethers.parseEther("0.01")}))
                .to.be.revertedWith("no bucheng")
        }
    )

    // 测试用例：窗口开启时，发送的以太币价值小于最低要求，资助失败
    it("window open, value is less than minimum, fund failed", 
        async function() {
            // 发送0.01 ETH到receiveEther函数，期望交易被拒绝，并提示"You need to send at least 1 ETH"
            await expect(fundme.receiveEther({value: ethers.parseEther("0.001")}))
                .to.be.revertedWith("You need to send atleast 1 ETH")
        }
    )

    // 测试用例：窗口开启时，发送的以太币价值大于最低要求，资助成功
    it("Window open, value is greater minimum, fund success", 
        async function() {
            // 发送0.1 ETH到receiveEther函数，确保金额满足最低要求
            await fundme.receiveEther({value: ethers.parseEther("0.01")})
            // 查询指定账户(firstAccount)在fundCollected中的余额
            const balance = await fundme.fundCollected(firstAccount)
            // 验证余额是否等于发送的0.1 ETH
        expect(balance).to.equal(ethers.parseEther("0.01"))
            //console.log("balance:", balance)
            //console.log(firstAccount)
        }
    )


    // 测试用例：非所有者调用getFund，窗口已关闭，目标已满额，获取失败
     it("not onwer, window closed, target reached, getFund failed", 
        async function() {
            // make sure the target is reached 
            await fundme.receiveEther({value: ethers.parseEther("0.02")})

            // make sure the window is closed
            await helpers.time.increase(200)
            await helpers.mine()

            await expect(fundMeSecondAccount.getfundme())
                .to.be.revertedWith("Only owner")
        }
    )

    // 测试用例：非所有者调用getFund，窗口已开启，目标未满额，获取失败
    it("window open, target reached, getFund failed", 
        async function() {
            await fundme.receiveEther({value: ethers.parseEther("0.02")})
            await expect(fundme.getfundme())
                .to.be.revertedWith("no bucheng")
        }
    )

    // 测试用例：窗口已关闭，目标未满额，获取失败
    it("window closed, target not reached, getFund failed",
        async function() {
            await fundme.receiveEther({value: ethers.parseEther("0.01")})
            // make sure the window is closed
            await helpers.time.increase(200)
            await helpers.mine()            
            await expect(fundme.getfundme())
                .to.be.revertedWith("1")
        }
    )
    // 测试用例：窗口已关闭，目标已满额，获取成功
    it("window closed, target reached, getFund success", 
        async function() {
            await fundme.receiveEther({value: ethers.parseEther("0.02")})
            // make sure the window is closed
            await helpers.time.increase(200)
            await helpers.mine()   
            await expect(fundme.getfundme())
                .to.emit(fundme, "FundWithdrawByOwner")
                .withArgs(ethers.parseEther("0.02"))
        }
    )

    //  测试用例：窗口已开启，目标未满额，获取失败
    it("window open, target not reached, funder has balance", 
        async function() {
            await fundme.receiveEther({value: ethers.parseEther("0.01")})
            await expect(fundme.refundme())
                .to.be.revertedWith("no bucheng");
        }
    )

    //
    it("window closed, target reach, funder has balance", 
        async function() {
            await fundme.receiveEther({value: ethers.parseEther("0.02")})
            // make sure the window is closed
            await helpers.time.increase(200)
            await helpers.mine()  
            await expect(fundme.refundme())
                .to.be.revertedWith("meiyou");
        }
    )

    //
    it("window closed, target not reach, funder does not has balance", 
        async function() {
            await fundme.receiveEther({value: ethers.parseEther("0.01")})
            // make sure the window is closed
            await helpers.time.increase(200)
            await helpers.mine()  
            await expect(fundMeSecondAccount.refundme())
                .to.be.revertedWith("You haven't fund me");
        }
    )


    it("window closed, target not reached, funder has balance", 
        async function() {
            await fundme.receiveEther({value: ethers.parseEther("0.01")})
            // make sure the window is closed
            await helpers.time.increase(200)
            await helpers.mine()  
            await expect(fundme.refundme())
                .to.emit(fundme, "RefundByFunder")
                .withArgs(firstAccount, ethers.parseEther("0.01"));
        }
    )











})
