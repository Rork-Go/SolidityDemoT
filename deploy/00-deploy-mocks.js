const { DECIMAL, INITIAL_ANSWER, devlopmentChains} = require("../helper-hardhat-config")

// 导出一个异步函数，用于部署智能合约 脚本
module.exports = async ({ getNamedAccounts, deployments }) => {


    if (devlopmentChains.includes(network.name)) {
    // 获取命名账户中的第一个账户
    const accounts1 = (await getNamedAccounts()).firstAccount
    // const {accounts1} = await getNamedAccounts()
    // 获取部署相关的方法
    const deploy = deployments.deploy
    // const {deploy} = deployments

    // 打印账户信息和部署信息，用于调试
    //console.log(getNamedAccounts())
    //console.log(deployments)

    
        // 部署MockV3Aggregator合约
    // 参数:
    // - from: 指定部署合约的账户地址
    // - args: 合约构造函数的参数数组，包含DECIMAL和INITIAL_ANSWER
    // - log: 设置为true以打印部署日志信息
    await deploy("MockV3Aggregator", {
        from: accounts1,
        args: [DECIMAL, INITIAL_ANSWER],
        log: true,
    })
    // 打印部署信息和账户信息
    //console.log(`123先运行deploy文件下的js  ${accounts1}`)
    }else{
        console.log("当前网络非开发环境,不部署Mock")
    }

}
    

// 为当前模块定义标签，便于后续的部署任务管理
//npx hardhat deploy --tags frank
//npx hardhat deploy --tags all
module.exports.tags = ["all", "mocks"]