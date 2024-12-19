import Swal from "sweetalert2";
import { ethers } from "ethers";
import abi from "../constants/abi/nft.json";

const provider = new ethers.providers.JsonRpcProvider("https://1rpc.io/sepolia");

const getNFTName = async (address) => {
	try {
		const contract = new ethers.Contract(address, abi, provider);
		return await contract.name();
	} catch (e) {
		Swal.fire({
			title: "Error!",
			text: e.message,
			icon: "error",
		});
	}
};

const getNFTSymbol = async (address) => {
	try {
		const contract = new ethers.Contract(address, abi, provider);
		return await contract.symbol();
	} catch (e) {
		Swal.fire({
			title: "Error!",
			text: e.message,
			icon: "error",
		});
	}
};

const getNFTBalance = async (address, user) => {
	try {
		const contract = new ethers.Contract(address, abi, provider);
		return Number(await contract.balanceOf(user));
	} catch (e) {
		Swal.fire({
			title: "Error!",
			text: e.message,
			icon: "error",
		});
	}
};

const setMintNFT = async (address) => {
	try {
		if (window.ethereum) {
			const ethereum = window.ethereum;
			const provider = new ethers.providers.Web3Provider(ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(address, abi, signer);
			return await contract.mint();
		}
	} catch (e) {
		Swal.fire({
			title: "Error!",
			text: e.message,
			icon: "error",
		});
	}
};

const NFTHelper = {
	getNFTName,
	getNFTSymbol,
	getNFTBalance,
	setMintNFT,
};

export default NFTHelper;
