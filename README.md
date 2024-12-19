# NFT Marketplace Demo

This project's goal is develop a simple frontend application that allows users to connect their MetaMask wallet and mint an NFT using a smart contract.

<br />

**SMART CONTRACT**

The code is in the smartcontract folder. Instruction to run the project can be seen in _package.json_ file.

Command to do:

-   testing: `npm run test`,
-   coverage: `npm run coverage`,
-   deploy to sepolia testnet: `npm run deploy:sepolia`
-   verify smart contract in sepolia testnet: `npm run verify:sepolia`
-   verify smart contract with argument in sepolia testnet: `npm run verify:args:sepolia`

For development testing purpose, I have deployed the smart contract in sepolia testnet. The contract address for NFT Factory is 0x4660B33728a3819153b815007b9fE567f9c3b89D (you can view it on blockchain explorer: https://sepolia.etherscan.io/address/0x4660B33728a3819153b815007b9fE567f9c3b89D)

<br />

**FRONTEND**

The code is in the frontend folder. Instruction to run the project can be seen in _package.json_ file.

Command to do:

-   run on localhost: `npm run dev`,
-   build the project: `npm run build`,
