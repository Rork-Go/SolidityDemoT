const {task} = require("hardhat/config")

task("interact-fundme", "Interact with FundMe contract").addParam("addr","fundme address").setAction(async (taskArgs , hre) => {


    const fundMeFactory = await ethers.getContractFactory("fundme");
    const fundme =  fundMeFactory.attach(taskArgs.addr)


        // init 2 accounts 链接两个账户
        const [firstAccount,secondAccount] = await ethers.getSigners()
        console.log("4")
    
        // fund contract with first account  支付0.01ETH fundme调用的是fundme合约中的支付函数receiveEther
        //const first =await fundme.fund({value: ethers.parseEther("0.01")})
        // const fundTx = await fundMe.fund({value: ethers.parseEther("0.5")})
        const first = await fundme.receiveEther({ value: ethers.parseEther("0.01") });
    
        await first.wait()
        //console.log(`2 accounts are ${firstAccount.address} and ${secondAccount.address}`)
    
        // check balance of contract
        const balanceofFirst =await ethers.provider.getBalance(fundme.target)
        console.log(`The balance of contract is ${balanceofFirst}`)
    
        // fund contract with second account
        const second =await fundme.connect(secondAccount).receiveEther({value: ethers.parseEther("0.02")})
        await second.wait()
    
        // check balance of contract，获取合约的余额
    
        const balanceofSecond =await ethers.provider.getBalance(fundme.target)
        console.log(`The balance of contract is ${balanceofSecond}`)
    
        // check mapping 获取地址的在项目中的mapping映射值  即支付的ETH总数
        const isFunded = await fundme.fundCollected(firstAccount.address)
        console.log(`The address ${firstAccount.address} is funded with ${isFunded}`)
    
        // check mapping 
        const isFunded2 = await fundme.fundCollected(secondAccount.address)
        console.log(`The address ${secondAccount.address} is funded with ${isFunded2}`)



})

module.exports = {}