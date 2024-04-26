const ethers =  require('ethers');
const contract_data = require('../build/ERC20.json');


async function main () {

	const provider = new ethers.WebSocketProvider(
                `ws://127.0.0.1:8545`
        )

	const factory = new ethers.ContractFactory(contract_data.abi, contract_data.bytecode);

	// If your contract requires constructor args, you can specify them here
	const contract = await factory.deploy("12", "TEST", "TEST TOKEN", "1000000000000000000000");

	console.log(contract.address);
	console.log(contract.deployTransaction);
}

main();