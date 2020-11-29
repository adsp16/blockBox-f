import BlockBox from "../contracts/BlockBox.json";

export const getBlockBox = async (web3) => {
  return new Promise(async (resolve, reject) => {
    const networkId = await web3.eth.net.getId();
    const networkData = await BlockBox.networks[networkId];

    if (networkData) {
      //Create javascript version of the contract
      const blockBox = new web3.eth.Contract(BlockBox.abi, networkData.address);
      resolve(blockBox);
    } else {
      window.alert("No contract address found on the network! Try another");
      resolve();
    }
  });
};
