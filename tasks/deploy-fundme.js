const {task} = require("hardhat/config")

//task入参为任务名字，setAction为任务执行逻辑qqqqq
task("deploy-fundme","123").setAction(async (taskArgs ,hre) => {


    const fundMeFactory = await ethers.getContractFactory("fundme");
    console.log("1")
    const fundme = await fundMeFactory.deploy(300);
    await fundme.waitForDeployment()
    console.log("123 address: " + fundme.target)
    console.log("Contract functions:", Object.keys(fundme)); // 可查看可用方法

    
    if(hre.network.config.chainId == 11155111 && process.env.APIKEY){

    await fundme.deploymentTransaction().wait(6)
      console.log("2")
      //使用脚本部署验证
    await verifyfunction(fundme.target, [300])
    console.log("成功")
    
    }else{
      console.log("3")
    }

    async function verifyfunction(_funaddress1,_args1){
        await hre.run("verify:verify", {
        //address: fundme.target,
        address: _funaddress1,
        constructorArguments: _args1,


        

        }); 
        
    }

    

})

module.exports = {}