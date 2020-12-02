// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/Access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title A storage contract that you can pay IPFS hash's ether
/// @author Adam Scott Price
/// @notice You can use this contract to upload files to IPFS system and send uploader a thankyou in the form of ether!!

contract BlockBox is Pausable, Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    // Global Varaibles
    /// @notice string that holds the contract name
    string public name = "BlockBox";
    /// @notice an integer to hold the total number of files stored in the cotract
    uint256 public fileCount = 0;
    ///@notice A mapping that hold all the uploaded file data including IPFS hash
    mapping(uint256 => File) public files;
    ///@notice A varaible that maps IPFS hash to an uploader's address
    mapping(string => address) public hashAddress;
    ///@notice A varaible that maps address balances
    mapping(address => uint256) public balances;

    ///@notice A struct that defines the uploaded file structure
    struct File {
        uint256 fileId;
        address payable uploader;
        string fileHash;
        string fileType;
        uint256 fileSize;
        string fileName;
        uint256 uploadTime;
    }

    ///@notice Event emitted when a fileUploaded function is called
    event FileUploaded(
        uint256 fileId,
        address payable uploader,
        string fileHash,
        string fileType,
        uint256 fileSize,
        string fileName,
        uint256 uploadTime
    );

    ///@dev constructor function construct openzepplin contracts
    constructor() public Pausable() Ownable() ReentrancyGuard() {}

    ///@notice runs when contract calls a function that does not exist
    fallback() external payable {}

    ///@notice stops interaction with the contract only contract admin can use this function
    ///@dev called from the Pausable contract
    function hitCircuitBreaker() external onlyOwner() {
        _pause();
    }

    ///@notice restarts interaction with the contract
    ///@dev called from the Pausable contract only callable by owner, only callable when paused()
    function killCircuitBreaker() external whenPaused() onlyOwner() {
        _unpause();
    }

    ///@notice uploads a file to IPFS and stores information
    ///@dev hashaddress is mapped to hashaddress, filecount in incremented and sender address stored, event is also triggered

    function uploadFile(
        string memory _fileHash,
        string memory _fileType,
        uint256 _fileSize,
        string memory _fileName
    ) public whenNotPaused() {
        // Require a file fileName
        require(bytes(_fileName).length > 0);
        // Require a file type
        require(bytes(_fileType).length > 0);
        // Require a file hash true
        require(bytes(_fileHash).length > 0);
        // Require a uploader address
        require(msg.sender != address(0));
        //Require file size
        require(_fileSize > 0);

        //Increment file count
        fileCount = SafeMath.add(fileCount, 1);
        //Map hash to sender address
        hashAddress[_fileHash] = msg.sender;

        //Store files
        files[fileCount] = File(
            fileCount,
            msg.sender,
            _fileHash,
            _fileType,
            _fileSize,
            _fileName,
            now
        );
        //Event Trigger
        emit FileUploaded(
            fileCount,
            msg.sender,
            _fileHash,
            _fileType,
            _fileSize,
            _fileName,
            now
        );
    }

    ///@notice pays a stored IPFS hash a set amount of ether
    ///@dev address cant be null and passed has length must be greater than 0.
    ///@param _hash The IPFS has where the file is stored in the inter planetary file system

    function payHash(string memory _hash) public payable whenNotPaused() {
        require(bytes(_hash).length > 0);
        require(msg.sender != address(0));

        address uploader = hashAddress[_hash];
        uint256 currBalance = balances[uploader];
        balances[uploader] = currBalance.add(msg.value);
    }

    ///@notice withdraws funds you have stored against your address
    ///@param _amount The amount you want to withdraw
    function withdraw(uint256 _amount)
        external
        payable
        whenNotPaused()
        nonReentrant()
    {
        require(msg.sender != address(0));
        require(balances[msg.sender] > _amount, "Not Enough Balance");

        msg.sender.transfer(_amount);
        balances[msg.sender] = SafeMath.sub(balances[msg.sender], _amount);
    }
}
