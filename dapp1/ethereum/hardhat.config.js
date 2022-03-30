require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  paths: {
    artifacts: '../src/artifacts',
  },
  networks: {
    hardhat: {
    },
    rinkeby: {
      url:"https://rinkeby.infura.io/v3/b6a92872e9a34764855de1e6405adf3a",
      accounts:[`0x25f6d7f4e16ca47ee150c9334b7635433732b72003a8c00457fa82705db3f129`]
    }
  }
};
