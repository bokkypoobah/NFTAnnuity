# NFTAnnuity
Get a loan on your CryptoPunk, ERC-721 &amp; ERC-1177 NFTs

https://etherscan.io/address/0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb#code


### Testing

#### Clone Repository
Check out this repository into your projects subfolder:

```
git clone https://github.com/ogDAO/Governance.git
cd Governance
```

<br />

#### Install Hardhat


If not already installed, you will need [NPM](https://www.npmjs.com/). [NVM](https://github.com/nvm-sh/nvm) may take away some of your NPM versioning pain.

You will need to install the [Hardhat](https://hardhat.org/) testing framework:

```
npm install --save-dev hardhat @nomiclabs/hardhat-ethers chai ethers @nomiclabs/hardhat-waffle ethereum-waffle
# npm install --save bignumber.js
# npm install --save decimal.js
```

<br />

#### Install Truffle Flattener And Flatten Solidity Files

Install [Truffle Flattener](https://github.com/nomiclabs/truffle-flattener) using the command:

```
npm install -g truffle-flattener
./10_flattenSolidityFiles.sh
```

The flattened files can be found in the [./flattened/](./flattened/) subdirectory.

<br />
