# 🚀 BlockBox

Block Box is a file transfer interface that uploads files to the 🌎 Inter Planetary File System 🌎 and stores hash data on the blockchain and gives users the tools to share and track uploads. It also allows downloaders to buy the uploaders a coffee for their data sharing efforts.

## 🛠 Technology

- Storage logic is open-source and is an Ethereum smart contract written in Solidity
- Truffle
- Openzeppelin
- NodeJS
- React
- Web3
- IPFS (infura)

## Prerequisites

- Node v15.1.0
- Truffle v5.1.52 (core: 5.1.52)
- Solidity - 0.6.0 (solc-js)
- Node v15.1.0
- Web3.js v1.2.9

> Directory Structure

## Folder Structure

    .
    ├── client                  # Client Side Files (React-Frontend)
    ├── contracts               # Solidity Contracts
    ├── migrations              # Deployer Functions
    └── test                    # Automated tests (alternatively `spec` or `tests`)

### 🚀‍ Development

et Started on http://localhost:3000/

#Start by installing node modules for backend/contract code

```sh
$ cd npm install
```

Change directory to client-side code

```sh
$ cd client
```

then

```sh
$ npm install
```

## Ganache

Spin up a local blockchain on port 7545 (e.g. using [Ganache](https://www.trufflesuite.com/ganache))

Compile and migrate the contract to you local chain by running :

```sh
$ truffle migrate --reset
```

#Start 🚀‍ development server on localhost

```sh
/topleveldirectory/client
$ npm start
```

### Metamask

Ensure your browser has a plugin (e.g. [Metamask](https://metamask.io/)) that allows you to interact with the Ethereum blockchain

## ✅ Testing

- You can run the tests by running `truffle test` from the main directory
