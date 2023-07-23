const { ethers } = require("hardhat");
//npx hardhat run --network truffledashboard deploy/deploy.ts

async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
    // Deploy the Oracle contract
    const Contract = await ethers.getContractFactory("DataAsserter");
    // const contract = await Contract.deploy();
    const contract = await Contract.deploy("0x07865c6E87B9F70255377e024ace6630C1Eaa37F", "0x9923D42eF695B5dd9911D05Ac944d4cAca3c4EAB", "0xbF7561af8aba340fCbbc51cf4652DFb1845804DE");
    await contract.deployed();
    console.log("Contract deployed to:", contract.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
