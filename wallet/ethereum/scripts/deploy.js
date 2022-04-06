// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const CustodialWallet = await hre.ethers.getContractFactory("CustodialWallet");
  const wallet = await CustodialWallet.deploy();
  await wallet.deployed();

  const WalletFactory = await hre.ethers.getContractFactory("WalletFactory");
  const walletFactory = await WalletFactory.deploy(wallet.address);
  await walletFactory.deployed();
  console.log("Factory deployed to with implementation ", walletFactory.address, wallet.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
