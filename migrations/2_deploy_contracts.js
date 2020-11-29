const BlockBox = artifacts.require("./BlockBox.sol");


module.exports = function (deployer) {
  deployer.deploy(BlockBox);
};

