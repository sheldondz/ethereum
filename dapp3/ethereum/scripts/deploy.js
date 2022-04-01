
const hre = require("hardhat");
const main = async() => {

    const nftFactory = await hre.ethers.getContractFactory("Nft");
    const nftContract = await nftFactory.deploy();
    await nftContract.deployed();
    console.log("Contract deployed to:", nftContract.address);
    try {
        let nftTxn = await nftContract.mingNFT();
        nftTxn.wait();
    }catch (err) {
        console.log(err);
    }
}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();