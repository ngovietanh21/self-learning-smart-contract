const hre = require("hardhat");

const main = async () => {
  const MyToken = await hre.ethers.getContractFactory("MyToken");
  const token = await MyToken.deploy();

  await token.deployed();

  console.log("Toklen deployed to: ", token.address)
  //0xABCdD9e35214Fdd20c9a795103010b9231A47Ec9
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

runMain();
