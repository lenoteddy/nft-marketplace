import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import StringHelper from "./helpers/StringHelper";
import NFTFactoryHelper from "./helpers/NFTFactoryHelper";
import NFTHelper from "./helpers/NFTHelper";

function App() {
	const correctNetwork = "0xaa36a7";
	const [network, setNetwork] = useState("");
	const [account, setAccount] = useState("");
	const [tokenUri, setTokenUri] = useState("");
	const [tokenName, setTokenName] = useState("");
	const [tokenSymbol, setTokenSymbol] = useState("");
	const [loadingTx, setLoadingTx] = useState(false);
	const [nfts, setNFTs] = useState([]);
	const [noNftData, setNoNftData] = useState(false);

	const connectWallet = async () => {
		if (window.ethereum) {
			window.ethereum
				.request({ method: "eth_requestAccounts" })
				.then(async (accounts) => {
					if (accounts && accounts.length > 0) {
						setAccount(accounts[0]);
						if (window.ethereum) {
							window.ethereum.request({ method: "eth_chainId" }).then((val) => {
								setNetwork(val);
							});
						}
					} else {
						Swal.fire({
							title: "Error!",
							text: "No accounts found",
							icon: "error",
						});
					}
				})
				.catch((error) => {
					Swal.fire({
						title: "Error!",
						text: error?.message,
						icon: "error",
					});
				});
		} else {
			Swal.fire({
				title: "Error!",
				text: "MetaMask is not installed",
				icon: "error",
			});
		}
	};

	const switchNetwork = async () => {
		if (window.ethereum) {
			await window.ethereum
				.request({
					method: "wallet_switchEthereumChain",
					params: [{ chainId: "0xaa36a7" }],
				})
				.then(() => {
					setNetwork(correctNetwork);
				})
				.catch((error) => {
					Swal.fire({
						title: "Error!",
						text: error?.message,
						icon: "error",
					});
				});
		} else {
			Swal.fire({
				title: "Error!",
				text: "MetaMask is not installed",
				icon: "error",
			});
		}
	};

	const fetchNFTs = useCallback(async () => {
		const dataLength = await NFTFactoryHelper.getNFTLength();
		if (Number(dataLength) === 0) {
			setNoNftData(true);
		} else {
			setNFTs([]);
			for (let i = dataLength; i > 0; i--) {
				const nftAddress = await NFTFactoryHelper.getNFT(i - 1);
				const nftName = await NFTHelper.getNFTName(nftAddress);
				const nftSymbol = await NFTHelper.getNFTSymbol(nftAddress);
				const nftBalance = await NFTHelper.getNFTBalance(nftAddress, account);
				const data = {
					nftAddress,
					nftName,
					nftSymbol,
					nftBalance,
				};
				setNFTs((prevItems) => [...prevItems, data]);
			}
		}
	}, [account]);

	const createNFT = async (e) => {
		e.preventDefault();
		try {
			setLoadingTx(true);
			const tx = await NFTFactoryHelper.setCreateNFT(tokenUri, tokenName, tokenSymbol);
			await tx.wait();
			Swal.fire({
				title: "Success!",
				text: "NFT has been created successfully.",
				icon: "success",
			});
			setLoadingTx(false);
			fetchNFTs();
		} catch (e) {
			console.log(e);
			setLoadingTx(false);
		}
	};

	const mintNFT = async (address) => {
		try {
			setLoadingTx(true);
			const tx = await NFTHelper.setMintNFT(address);
			await tx.wait();
			Swal.fire({
				title: "Success!",
				text: "NFT has been minted successfully.",
				icon: "success",
			});
			setLoadingTx(false);
			fetchNFTs();
		} catch (e) {
			console.log(e);
			setLoadingTx(false);
		}
	};

	useEffect(() => {
		if (account && network == correctNetwork) fetchNFTs();
	}, [account, network, fetchNFTs]);

	return (
		<main className="container">
			<div className={"overlay " + (loadingTx ? "active" : "")}>
				<div className="loading-box">
					<div className="bg-white">
						<div className="-mt-2 mb-1 text-center font-bold">Loading...</div>
						<div className="loadingbar">
							<span className="w-full"></span>
						</div>
					</div>
				</div>
			</div>
			<div className="flex justify-center items-center gap-x-2 pb-4">
				<button className={"btn-connect " + (account ? "active" : "")} onClick={connectWallet}>
					{account ? StringHelper.shortenHex(account) : "Connect Wallet"}
				</button>
				{account && network !== correctNetwork && (
					<button className="btn-network" onClick={switchNetwork}>
						Switch Network
					</button>
				)}
			</div>
			{account && network == correctNetwork && (
				<div className="nft-container">
					<form className="nft-creator-form-container" onSubmit={createNFT}>
						<fieldset className="px-6 py-4 border-2 border-black">
							<legend className="px-4 text-lg text-center font-bold">NFT Creator Form</legend>
							<div className="mb-2">
								<label htmlFor="tokenURI" className="font-bold">
									Token URI
								</label>
								<input
									required
									type="uri"
									id="tokenURI"
									name="tokenURI"
									placeholder="Input Token URI value"
									className="border border-black rounded w-full py-2 px-3 text-gray-700 text-sm"
									value={tokenUri}
									onChange={(e) => setTokenUri(e.target.value)}
								/>
							</div>
							<div className="mb-2">
								<label htmlFor="tokenName" className="font-bold">
									Token Name
								</label>
								<input
									required
									type="text"
									id="tokenName"
									name="tokenName"
									placeholder="Input Token Name value"
									className="border border-black rounded w-full py-2 px-3 text-gray-700 text-sm"
									value={tokenName}
									onChange={(e) => setTokenName(e.target.value)}
								/>
							</div>
							<div className="mb-2">
								<label htmlFor="tokenSymbol" className="font-bold">
									Token Symbol
								</label>
								<input
									required
									type="text"
									id="tokenSymbol"
									name="tokenSymbol"
									placeholder="Input Token Symbol value"
									className="border border-black rounded w-full py-2 px-3 text-gray-700 text-sm"
									value={tokenSymbol}
									onChange={(e) => setTokenSymbol(e.target.value)}
								/>
							</div>
							<button type="submit" className="mt-4 btn-create" disabled={loadingTx}>
								Create an NFT
							</button>
						</fieldset>
					</form>
					<fieldset className="mt-8 p-4 border-2 border-black">
						<legend className="px-4 text-lg text-center font-bold">NFT List</legend>
						{noNftData && <div className="text-center font-bold">No NFT list available!</div>}
						{nfts.length > 0 && (
							<div className="grid grid-cols-3 gap-4">
								{nfts.map((val, idx) => {
									return (
										<div key={idx}>
											<div className="block max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow break-all">
												<h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">{`${val?.nftSymbol} - ${val?.nftName}`}</h5>
												<p className="text-xs text-gray-700">
													<span className="font-bold">address:</span>
													<span className="pl-1">{val?.nftAddress}</span>
												</p>
												<p className="text-xs text-gray-700">
													<span className="font-bold">balance:</span>
													<span className="pl-1">{val?.nftBalance}</span>
												</p>
												<button type="button" className="mt-4 btn-mint" disabled={loadingTx} onClick={() => mintNFT(val?.nftAddress)}>
													Mint NFT
												</button>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</fieldset>
				</div>
			)}
		</main>
	);
}

export default App;
