require("@nomiclabs/hardhat-waffle");
require("solidity-coverage");
require("hardhat/config")
require("./task/Voting.js")

require('dotenv').config();
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL;
const MNEMONIC = process.env.MNEMONIC;


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
  solidity: "0.7.0",
  networks: {
    rinkeby: {
      url: RINKEBY_RPC_URL,
      accounts: {
        mnemonic: MNEMONIC,
      },
    }
  }

};
