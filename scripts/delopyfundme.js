const {ethers} = require("hardhat");

 async function main() { 
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
    await hre.run("verify:verify", {
      //address: fundme.target,
      address: await fundme.getAddress(),
      constructorArguments: [300],

    }); 
    }else{
      console.log("3")
    }


    // init 2 accounts
    const [firstAccount,secondAccount] = await ethers.getSigners()
    console.log("4")

    // fund contract with first account
    //const first =await fundme.fund({value: ethers.parseEther("0.01")})
    // const fundTx = await fundMe.fund({value: ethers.parseEther("0.5")})
    const first = await fundme.receiveEther({ value: ethers.parseEther("0.01") });

    await first.wait()
    //console.log(`2 accounts are ${firstAccount.address} and ${secondAccount.address}`)

    // check balance of contract
    const balanceofFirst =await ethers.provider.getBalance(fundme.target)
    console.log(`The balance of contract is ${balanceofFirst}`)

    // fund contract with second account
    const second =await fundme.connect(secondAccount).receiveEther({value: ethers.parseEther("0.01")})
    await second.wait()

    // check balance of contract
    const balanceofSecond =await ethers.provider.getBalance(fundme.target)
    console.log(`The balance of contract is ${balanceofSecond}`)

    // check mapping 
    const isFunded = await fundme.fundCollected(firstAccount.address)
    console.log(`The address ${firstAccount.address} is funded with ${isFunded}`)

    // check mapping 
    const isFunded2 = await fundme.fundCollected(secondAccount.address)
    console.log(`The address ${secondAccount.address} is funded with ${isFunded2}`)

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });