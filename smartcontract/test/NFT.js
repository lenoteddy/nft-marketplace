const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT", function () {
	let contract = null;
	let provider = null;
	let accounts = null;

	beforeEach(async function () {
		accounts = await ethers.getSigners();
		provider = await ethers.provider;

		const ContractFactory = await ethers.getContractFactory("NFTFactory");
		contract = await ContractFactory.deploy();
		await contract.waitForDeployment();
	});

	/* NFTFactory contract test cases */
	describe("createNFT()", function () {
		it("Should create an NFT contract", async function () {
			await expect(await contract.createNFT("https://www.google.com/", "My NFT", "NFT")).to.be.ok;
		});
	});

	describe("getNFTLength()", function () {
		it("Should get amount of NFT contract created", async function () {
			await expect(await contract.getNFTLength()).to.be.equal(0);
		});
	});

	/* NFT contract test cases */
	describe("mint()", function () {
		it("Should be able to mint an NFT", async function () {
			await contract.createNFT("https://www.google.com/", "My NFT", "NFT");
			const nftAddress = await contract.nft(0);
			NFT = await ethers.getContractFactory("NFT");
			nft = NFT.attach(nftAddress);
			await expect(await nft.mint()).to.be.ok;
		});
	});

	describe("tokenURI()", function () {
		it("Should be able to retrieve NFT uri", async function () {
			await contract.createNFT("https://www.google.com/", "My NFT", "NFT");
			const nftAddress = await contract.nft(0);
			NFT = await ethers.getContractFactory("NFT");
			nft = NFT.attach(nftAddress);
			await nft.mint();
			await expect(await nft.tokenURI(0)).to.be.equal("https://www.google.com/0");
		});
	});
});
