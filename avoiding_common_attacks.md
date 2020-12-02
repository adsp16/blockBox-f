##🚧 Avoiding Common Attacks
These are the steps taken to aviod known security vunerbalities that are commonly attacked in smart contracts.

## Integer Over/Underflow

Given that uint type is used throught the contract the battle tested SafeMath.sol libary from @openzeppelin has been used to do all math within the contract to prevent large numbers being over/under flowed for example SafeMath.add(fileId, 1).

## Reentrancy

To prevent an attacker from calling withdraw multiple times before contract execution is over (thereby draining the contract's fund), the ReentrancyGaurd.sol contract is used disables the contract from being called whilst the function is executing.
