const shortenHex = (hexString) => {
	if (hexString.startsWith("0x")) {
		return hexString.slice(0, 6) + "..." + hexString.slice(-4);
	}
	return hexString;
};

const StringHelper = {
	shortenHex,
};

export default StringHelper;
