import { ethers } from "ethers";
import abi from "../constants/abi/nftFactory.json";

const address = "0x4660B33728a3819153b815007b9fE567f9c3b89D";
const provider = new ethers.providers.JsonRpcProvider("https://1rpc.io/sepolia");
const contract = new ethers.Contract(address, abi, provider);

const getNFT = async (index) => {
	try {
		const nft = await contract.nft(index);
		return nft;
	} catch (e) {
		console.log(e);
	}
};

const getNFTLength = async () => {
	try {
		const nftLength = await contract.nftLength();
		return nftLength;
	} catch (e) {
		console.log(e);
	}
};

const setCreateNFT = async (tokenUri, tokenName, tokenSymbol) => {
	try {
		if (window.ethereum) {
			const ethereum = window.ethereum;
			const provider = new ethers.providers.Web3Provider(ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(address, abi, signer);
			return await contract.createNFT(tokenUri, tokenName, tokenSymbol);
		}
	} catch (e) {
		console.log(e);
		alert(e.message);
	}
};

const NFTFactoryHelper = {
	getNFT,
	getNFTLength,
	setCreateNFT,
};

export default NFTFactoryHelper;
