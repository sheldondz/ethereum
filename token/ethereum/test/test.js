const { expect } = require("chai");
const { ethers } = require("hardhat");



describe("ZenoToken", function () {

  let token;
  let vendor;
  let accounts;

  beforeEach(async function(){
      const ZenoToken = await ethers.getContractFactory("ZenoToken");
      const tokenContract = await ZenoToken.deploy();
      token = await tokenContract.deployed();
      const Vendor = await ethers.getContractFactory("Vendor");
      const vendorContract = await Vendor.deploy(token.address);
      vendor = await vendorContract.deployed();
      await token.transfer(vendor.address, 100)
      accounts = await ethers.getSigners();
  });

  describe("Test total supply", function() {
    it("Checking total supply", async function () {
        const totalSupply = await token.totalSupply();
        expect(totalSupply).to.equal(1000);
    });
  });

  describe("Test balance", function() {
      it("Balance of token", async function() {
        expect(await token.balanceOf(accounts[0].address)).to.equal(900);
      });
  })

  describe("Transfer balance", function() {
      it("transfers half the balance", async function() {
         let txn = await token.transfer(accounts[1].address, 500);
         await txn.wait();
         expect(await token.balanceOf(accounts[0].address)).to.equal(400);
         expect(await token.balanceOf(accounts[1].address)).to.equal(500);
         txn = await token.connect(accounts[1]).transfer(accounts[0].address, 500);
         await txn.wait();
      });
  })

  describe("Buy tokens", function() {
      it("buys tokens from vendor", async function() {
          const txn = await vendor.connect(accounts[1]).buyTokens({ value: 10 });
          await txn.wait();
      });
  });

    describe("Buy tokens back", function() {
        it("buys tokens back from vendor", async function() {
            const txn = await token.approve(vendor.address, 30);
            await txn.wait();
            const buyBack = await vendor.sellTokens(30);
            await buyBack.wait();
        });
    });
});
