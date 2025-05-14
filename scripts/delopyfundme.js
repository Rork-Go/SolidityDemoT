const {ethers} = require("hardhat");

 async function main() { 
    const fundMeFactory = await ethers.getContractFactory("fundme");
    console.log("1")
    const fundMe = await fundMeFactory.deploy(10);
    await fundMe.waitForDeployment()
    console.log("123" + fundMe.target)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(0);
  });