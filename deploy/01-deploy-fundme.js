//非匿名函数
// function deployfundme (){
//     console.log("1")

// }

// module.exports.default = deployfundme  module.exports.default默认会导出函数

//匿名函数
// module.exports= async () => { 
//     console.log("2")

// }

//匿名函数进行传参   hre为运行是的环境对象
// module.exports = async (hre) => {
//     const NameAccounts =hre.getNameAccounts   //用于跟踪之前部署的所有合约
//     const deployments =hre.getDeployments
//     console.log("123")
//     console.log(hre)
    

// }
// const { network } = require("hardhat")
const {devlopmentChains, networkConfig, LOCK_TIME, CONFIRMATIONS} = require("../helper-hardhat-config")
// 导出一个异步函数，用于部署智能合约 脚本
module.exports = async ({ getNamedAccounts, deployments }) => {
    // 获取命名账户中的第一个账户
    const accounts1 = (await getNamedAccounts()).firstAccount
    // const {accounts1} = await getNamedAccounts()
    // 获取部署相关的方法
    const deploy = deployments.deploy
    // const {deploy} = deployments

    // 打印账户信息和部署信息，用于调试
    //console.log(getNamedAccounts())
    //console.log(deployments)

    // 根据当前网络确定数据源地址
    let dataFeedAddr
    let confirmations 
    // 如果当前网络是开发环境，则使用 MockV3Aggregator 模拟合约
    if (devlopmentChains.includes(network.name)) {
        // 获取部署的 MockV3Aggregator 合约
        const MockV3Aggregator = await deployments.get("MockV3Aggregator")
        // 使用模拟合约的地址作为数据源地址
        dataFeedAddr = MockV3Aggregator.address
        confirmations = 0
    } else {
        // 如果不是开发环境，则使用当前网络对应的实际数据源地址
        dataFeedAddr = networkConfig[network.config.chainId].ethUsdDataFeed
        confirmations = CONFIRMATIONS
    }


    // 部署名为"fundme"的智能合约，并传入相关参数
    const fundme = await deploy("fundme", {
        from: accounts1,
        args: [LOCK_TIME,dataFeedAddr],
        log: true,
        waitConfirmations: confirmations,
    })
    // 打印部署信息和账户信息
    //console.log(`123先运行deploy文件下的js  ${accounts1}`)
    if(hre.network.config.chainId == 11155111 && process.env.APIKEY){
       

        await hre.run("verify:verify", {
            address: fundme.address,
            constructorArguments: [LOCK_TIME,dataFeedAddr],
        });
    }else{
        console.log("123456789")
    }
}

// 为当前模块定义标签，便于后续的部署任务管理
//npx hardhat deploy --tags frank
//npx hardhat deploy --tags all
module.exports.tags = ["all", "fundme"]