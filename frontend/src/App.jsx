import { useState } from "react";
import StringHelper from "./helpers/StringHelper";

function App() {
	const correctNetwork = "0xaa36a7";
	const [network, setNetwork] = useState("");
	const [account, setAccount] = useState("");

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

	return (
		<main className="container">
			<div className="flex justify-center items-center gap-x-2 pb-4">
				<button className="btn-connect" onClick={() => connectWallet()}>
					{account ? StringHelper.shortenHex(account) : "Connect Wallet"}
				</button>
				{account && network !== correctNetwork && (
					<button className="btn-network" onClick={switchNetwork}>
						Switch Network
					</button>
				)}
			</div>
		</main>
	);
}

export default App;
