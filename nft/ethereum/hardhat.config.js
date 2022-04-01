require("@nomiclabs/hardhat-waffle");


/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  paths: {
    artifacts:"../src/artifacts"
  },
  networks: {
    hardhat: {
    },
    rinkeby: {
      url:"https://rinkeby.infura.io/v3/b6a92872e9a34764855de1e6405adf3a",
      accounts: [``]
    }
  }
};
