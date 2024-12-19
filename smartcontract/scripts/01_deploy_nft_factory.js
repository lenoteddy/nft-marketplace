const { ethers } = require("hardhat");

async function main() {
	const NFTFactory = await ethers.getContractFactory("NFTFactory");
	const nftFactory = await NFTFactory.deploy();
	await nftFactory.waitForDeployment();
	console.log("NFT Factory deployed to:", nftFactory.target);
}

main();
