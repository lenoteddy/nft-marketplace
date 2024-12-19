import { useState } from "react";
import StringHelper from "./helpers/StringHelper";
import NFTFactoryHelper from "./helpers/NFTFactoryHelper";

function App() {
	const correctNetwork = "0xaa36a7";
	const [network, setNetwork] = useState("");
	const [account, setAccount] = useState("");
	const [tokenUri, setTokenUri] = useState("");
	const [tokenName, setTokenName] = useState("");
	const [tokenSymbol, setTokenSymbol] = useState("");
	const [loadingTx, setLoadingTx] = useState(false);

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
						alert("No accounts found");
					}
				})
				.catch((error) => {
					alert(error?.message);
				});
		} else {
			alert("MetaMask is not installed");
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
					alert(error?.message);
				});
		} else {
			alert("MetaMask is not installed");
		}
	};

	const createNFT = async (e) => {
		e.preventDefault();
		try {
			setLoadingTx(true);
			const tx = await NFTFactoryHelper.setCreateNFT(tokenUri, tokenName, tokenSymbol);
			await tx.wait();
			window.location.reload();
		} catch (e) {
			console.log(e);
			setLoadingTx(false);
		}
	};

	return (
		<main className="container">
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
				</div>
			)}
		</main>
	);
}

export default App;
