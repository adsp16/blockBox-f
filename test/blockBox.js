const BlockBox = artifacts.require("./contracts/BlockBox.sol");
const chai = require("chai");
var chaiAsPromised = require("chai-as-promised");

//Use Shoudld Libary
chai.use(chaiAsPromised).should();

contract("BlockBox", ([caller]) => {
  let blockBoxContract;
  let blockAddress;
  const testAmount = web3.utils.toWei("1", "ether");

  let response;
  let fileId;
  const fileSize = 100;
  const fileHash = "4c87acc07afaaaeb888a414e0da2d2665";
  const fileType = "fileExtention";
  const fileName = "fileName.mp4";
  const withdrawAmount = web3.utils.toWei("1.2", "ether");

  before(async () => {
    try {
      blockBoxContract = await BlockBox.deployed();
      blockAddress = blockBoxContract.address;
      response = await blockBoxContract.uploadFile(
        fileHash,
        fileType,
        fileSize,
        fileName,
        { from: caller }
      );
      fileId = await blockBoxContract.fileCount();

      await blockBoxContract.payHash(fileHash, {
        from: caller,
        value: testAmount,
      });

      web3.eth.sendTransaction({
        from: caller,
        to: blockAddress,
        value: testAmount,
      });
    } catch (err) {
      console.log(err);
    }
  });

  describe("Check Deployment ", () => {
    it("Check contract is deployed correctly", async () => {
      const address = await blockBoxContract.address;
      assert(address != "");
    });

    it("Check address is valid", async () => {
      const address = await blockBoxContract.address;
      assert.notEqual(address, undefined);
      assert.notEqual(address, "");
      assert.notEqual(address, 0x0);
      assert.notEqual(address, null);
    });

    it("Check contract has name", async () => {
      const name = await blockBoxContract.name();
      assert.equal(name, "BlockBox");
    });
  });

  describe("Check Files", () => {
    //Event
    it("Should correctly upload a file", async () => {
      const uploadedEvent = response.logs[0].args;
      assert.equal(
        uploadedEvent.fileId.toNumber(),
        fileId.toNumber(),
        "Correct File ID"
      );
      assert.equal(
        uploadedEvent.fileHash,
        fileHash,
        "Hash is stored correctly"
      );
      assert.equal(
        uploadedEvent.fileSize,
        fileSize,
        "Size is stored correctly"
      );
      assert.equal(
        uploadedEvent.fileType,
        fileType,
        "Type is stored correctly"
      );
      assert.equal(
        uploadedEvent.fileName,
        fileName,
        "Name is stored correctly"
      );
      assert.equal(
        uploadedEvent.uploader,
        caller,
        "Caller is stored correctly"
      );
    });

    it("Should reject file with no hash", async () => {
      await blockBoxContract.uploadFile("", fileType, fileSize, fileName, {
        from: caller,
      }).should.be.rejected;
    });

    it("Should reject file with no size", async () => {
      await blockBoxContract.uploadFile(fileHash, fileType, "", fileName, {
        from: caller,
      }).should.be.rejected;
    });
    it("Should reject file with no type", async () => {
      await blockBoxContract.uploadFile(fileHash, "", fileSize, fileName, {
        from: caller,
      }).should.be.rejected;
    });

    it("Should reject file with no name", async () => {
      await blockBoxContract.uploadFile(fileHash, fileType, fileSize, "", {
        from: caller,
      }).should.be.rejected;
    });

    //Check Mapping Struct Get Files
    it("Get Correct File Values", async () => {
      const file = await blockBoxContract.files(fileId);

      assert.equal(
        file.fileId.toNumber(),
        fileId.toNumber(),
        "Correct File ID"
      );
      assert.equal(file.fileHash, fileHash, "Hash is stored correctly");
      assert.equal(file.fileSize, fileSize, "Size is stored correctly");
      assert.equal(file.fileType, fileType, "Type is stored correctly");
      assert.equal(file.fileName, fileName, "Name is stored correctly");
      assert.equal(file.uploader, caller, "Caller is stored correctly");
    });
  });

  describe("Payment & Withdrawals", () => {
    const testBalance = web3.utils.toWei("2", "ether");

    it("Should pay a hash", async () => {
      const hashAdd = await blockBoxContract.hashAddress(fileHash);
      const hashBalance = await blockBoxContract.balances(hashAdd);
      assert.equal(hashAdd, caller, "Hash address is equal");
      assert.equal(
        hashBalance.toString(),
        testBalance,
        "Hash balance updated + incremented"
      );
    });

    it("Should Withdraw Funds", async () => {
      await blockBoxContract.withdraw(withdrawAmount, { from: caller });
      const balance = await blockBoxContract.balances(caller);
      assert.equal(balance.toString(), web3.utils.toWei("0.8", "ether"));
    });
  });
}); // Contract
