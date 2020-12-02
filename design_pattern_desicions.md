## 💡 Design Pattern Decisions

A summary of design pattern decisions and smart contract best practices taken into account for the BlockBox contract.

### Circuit Breaker

The circuit breaker pattern has a hitCircuitBreaker() to pause the contract in the event that it is being abused or a bug is found and the contract needs to be upgraded. There is a hitCircuitBreaker() to unpause the contract. This can only be called by the owner.

### Restricting Access

The onlyOwner() function is inherited from @openzeppelin/contract/Ownable.sol to ensure that certain functions can only be called by the contract owner
