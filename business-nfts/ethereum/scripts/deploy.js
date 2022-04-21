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
  const forwarder = "0x83A54884bE4657706785D7309cf46B58FE5f6e8a";
  const baseERC721Contract = await hre.ethers.getContractFactory("ZenoERC721");
  const baseERC721 = await baseERC721Contract.deploy("ZenoNFT", "ZENO", hre.ethers.utils.getAddress(forwarder));
  await baseERC721.deployed();
  console.log("ERC721 deployed to:", baseERC721.address);

  const ERC721FactoryContract = await hre.ethers.getContractFactory("ZenoERC721Factory");
  const ERC721Factory = await ERC721FactoryContract.deploy(baseERC721.address);
  await ERC721Factory.deployed();
  console.log("ERC721 factory deployed to:", ERC721Factory.address);

  const businessContract = await ERC721Factory.createBusinessERC721Contract(100);
  console.log("ERC721 for business 100 deployed to:", businessContract);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
