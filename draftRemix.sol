// pragma solidity ^0.6.0;

// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Pausable.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/math/SafeMath.sol";

// contract BlockBox is Pausable, Ownable {
//     using SafeMath for uint256;

//     // Global Varaibles
//     string public name = "BlockBox";
//     uint256 public fileCount = 0;
//     uint256 uploadCount = 0;
//     mapping(uint256 => File) public files;
//     mapping(address => uint256) public uploads;
//     mapping(string => address) public hashAddress;
//     mapping(address => uint256) public balances;
//     address payable public admin;

//     // Struct
//     struct File {
//         uint256 fileId;
//         address payable uploader;
//         string fileHash;
//         string fileType;
//         uint256 fileSize;
//         string fileName;
//         uint256 uploadTime;
//     }

//     // Events
//     event FileUploaded(
//         uint256 fileId,
//         address payable uploader,
//         string fileHash,
//         string fileType,
//         uint256 fileSize,
//         string fileName,
//         uint256 uploadTime
//     );

//     //Constructor
//     constructor() public Pausable() Ownable() {
//         admin = msg.sender;
//     }

//     // //Modifiers
//     // modifier activeContract() {
//     //     require(isActive == true);
//     //     _;
//     // }

//     // Functions

//     function hitCircuitBreaker() external onlyOwner() {
//         _pause();
//     }

//     function killCircuitBreaker() external onlyOwner() {
//         _unpause();
//     }

//     function getOwner()
//         external
//         view
//         whenNotPaused()
//         onlyOwner()
//         returns (address)
//     {
//         return admin;
//     }

//     function updateUploads() external view returns (uint256) {
//         return uploads[msg.sender];
//     }

//     function increaseupload() public {
//         uint256 currValue = uploads[msg.sender];
//         uploads[msg.sender] = currValue.add(1);
//     }

//     // function checkIfPayment public returns(bool) {
//     //     if(uploads[msg.sender] > 0) {
//     //         return true;
//     //     } else {
//     //         return false;
//     //     }
//     // }

//     function uploadFile(
//         string memory _fileHash,
//         string memory _fileType,
//         uint _fileSize,
//         string memory _fileName
//     ) public {
//         // Require a file fileName
//         require(bytes(_fileName).length > 0);
//         // Require a file type
//         require(bytes(_fileType).length > 0);
//         // Require a file hash true
//         require(bytes(_fileHash).length > 0);

//         // Require a uploader address
//         require(msg.sender != address(0));
//         //Require a file size
//         require(_fileSize > 0);

//         fileCount.add(1);

//         hashAddress[_fileHash] = msg.sender;

//         uint currValue = uploads[msg.sender];
//         uploads[msg.sender] = currValue.add(1);

//         files[fileCount] = File(
//             fileCount,
//             msg.sender,
//             _fileHash,
//             _fileType,
//             _fileSize,
//             _fileName,
//             now
//         );

//         //Event Trigger
//         emit FileUploaded(
//             fileCount,
//             msg.sender,
//             _fileHash,
//             _fileType,
//             _fileSize,
//             _fileName,
//             now
//         );
//     }

//     function addHash(string memory _hash) public {
//         hashAddress[_hash] = msg.sender;
//     }

//     function payHash(string memory _hash) public payable {
//         address uploader = hashAddress[_hash];
//         uint256 currBalance = balances[uploader];
//         balances[uploader] = currBalance.add(msg.value);
//     }
// }
