const defaultWeb3 = new Web3(new Web3.providers.HttpProvider(""));
let oracleAddress = ""
let web3;
let connectedAccount;
let provider;


// load oracle price data
async function loadOracle(oracleAddress) {
    let abiOracle = [
    
    ];
    return await new defaultWeb3.eth.Contract(abiOracle, oracleAddress);
}


let oracle;
async function loadPaymentContracts() {
    oracle = await loadOracle(defaultWeb3);
}
loadPaymentContracts();

async function init() {
    provider = window.ethereum
    await provider.enable()
    web3 = await new Web3(provider);
    let accounts = await web3.eth.getAccounts();
    connectedAccount = accounts[0]
    console.log(connectedAccount)
}



