pragma solidity ^0.6.0;

import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/Access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract BlockBox is Pausable, Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    // Global Varaibles
    string public name = "BlockBox";
    uint256 public fileCount = 0;
    uint256 public freeCount = 1;
    mapping(uint256 => File) public files;
    mapping(string => address) public hashAddress;
    mapping(address => uint256) public balances;

    // Struct
    struct File {
        uint256 fileId;
        address payable uploader;
        string fileHash;
        string fileType;
        uint256 fileSize;
        string fileName;
        uint256 uploadTime;
    }

    // Events
    event FileUploaded(
        uint256 fileId,
        address payable uploader,
        string fileHash,
        string fileType,
        uint256 fileSize,
        string fileName,
        uint256 uploadTime
    );

    //Modifiers

    //Constructor
    constructor() public Pausable() Ownable() ReentrancyGuard() {}

    // Fallback Function
    fallback() external payable {
        uint256 currBalance = balances[msg.sender];
        balances[msg.sender] = currBalance.add(msg.value);
    }

    // //Fallback Function
    // function() external {}

    function hitCircuitBreaker() external onlyOwner() {
        _pause();
    }

    function killCircuitBreaker() external whenPaused() onlyOwner() {
        _unpause();
    }

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

        require(_fileSize > 0);

        fileCount = SafeMath.add(fileCount, 1);

        hashAddress[_fileHash] = msg.sender;

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

    function payHash(string memory _hash) public payable whenNotPaused() {
        require(bytes(_hash).length > 0);
        require(msg.sender != address(0));

        address uploader = hashAddress[_hash];
        uint256 currBalance = balances[uploader];
        balances[uploader] = currBalance.add(msg.value);
    }

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
