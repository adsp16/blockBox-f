const BlockBox = artifacts.require("./contracts/BlockBox.sol");
const chai = require("chai");
var chaiAsPromised = require("chai-as-promised");

//Use Shoudld Libary
chai.use(chaiAsPromised).should();

contract("BlockBox", ([caller]) => {
  let blockBoxContract;

  before(async () => {
    blockBoxContract = await BlockBox.deployed();
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
    let response;
    let fileId;

    const fileSize = 100;
    const fileHash =
      "4c87acc07afaaaeb888a414e0da2d2665ee9b39518ae1c5859e92f35ddcbe483";
    const fileType = "fileExtention";
    const fileName = "fileName.mp4";
    const fileMessage = "fileDescription";

    before(async () => {
      response = await blockBoxContract.uploadFile(
        fileHash,
        fileType,
        fileSize,
        fileName,
        { from: caller }
      );
      fileId = await blockBoxContract.fileCount();
    });

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
  }); // Describe Files
}); // Contract
