const defaultWeb3 = new Web3(new Web3.providers.HttpProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"));
let oracleAddress = "0x82FcCAA1c9d7130f8141109096c98B0c3D4fC5B6"
let registryAddress = "0xB0eAED426dFb2aEEFF37ec251aAA52aF2ce525F8"
let web3;
let connectedAccount;
let provider;
let oracle;
let registry;


// load uma oracle contract
async function loadOracle(oracleAddress) {
    let abiOracle = [
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_defaultCurrency",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_optimisticOracleV3",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_registryAddress",
              "type": "address"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "bytes32",
              "name": "dataId",
              "type": "bytes32"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "data",
              "type": "string"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "asserter",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "bytes32",
              "name": "assertionId",
              "type": "bytes32"
            }
          ],
          "name": "DataAsserted",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "bytes32",
              "name": "dataId",
              "type": "bytes32"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "data",
              "type": "string"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "asserter",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "bytes32",
              "name": "assertionId",
              "type": "bytes32"
            }
          ],
          "name": "DataAssertionResolved",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "dataId",
              "type": "bytes32"
            },
            {
              "internalType": "string",
              "name": "data",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "asserter",
              "type": "address"
            }
          ],
          "name": "assertDataFor",
          "outputs": [
            {
              "internalType": "bytes32",
              "name": "assertionId",
              "type": "bytes32"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "assertionId",
              "type": "bytes32"
            }
          ],
          "name": "assertionDisputedCallback",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "assertionLiveness",
          "outputs": [
            {
              "internalType": "uint64",
              "name": "",
              "type": "uint64"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "assertionId",
              "type": "bytes32"
            },
            {
              "internalType": "bool",
              "name": "assertedTruthfully",
              "type": "bool"
            }
          ],
          "name": "assertionResolvedCallback",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
            }
          ],
          "name": "assertionsData",
          "outputs": [
            {
              "internalType": "bytes32",
              "name": "dataId",
              "type": "bytes32"
            },
            {
              "internalType": "string",
              "name": "data",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "asserter",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "resolved",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "defaultCurrency",
          "outputs": [
            {
              "internalType": "contract IERC20",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "defaultIdentifier",
          "outputs": [
            {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "assertionId",
              "type": "bytes32"
            }
          ],
          "name": "getData",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            },
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "oo",
          "outputs": [
            {
              "internalType": "contract OptimisticOracleV3Interface",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "registry",
          "outputs": [
            {
              "internalType": "contract Registry",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ];
    return await new defaultWeb3.eth.Contract(abiOracle, oracleAddress);
}
// load uma oracle contract
async function loadRegistry(registryAddress) {
    let abiRegistry = [
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "bytes32",
              "name": "userId",
              "type": "bytes32"
            }
          ],
          "name": "Register",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "userId",
              "type": "bytes32"
            },
            {
              "internalType": "address",
              "name": "asserter",
              "type": "address"
            }
          ],
          "name": "addOwner",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "contractOwner",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "userId",
              "type": "bytes32"
            }
          ],
          "name": "getRegistration",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
            }
          ],
          "name": "owners",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "oracleAddress",
              "type": "address"
            }
          ],
          "name": "setOracle",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ];
    return await new defaultWeb3.eth.Contract(abiRegistry, registryAddress);
}
// load all contracts
async function loadPaymentContracts() {
    oracle = await loadOracle(oracleAddress);
    registry = await loadRegistry(registryAddress);
}
loadPaymentContracts();

// switch to required network
async function switchNetwork(web3, networkName, provider) {
    // Get current network ID
    const currentNetworkId = await web3.eth.net.getId();
    console.log("Currently connected with id: ", currentNetworkId)
  
    // Get network ID for desired network
    let desiredNetworkId;
    switch (networkName.toLowerCase()) {
      case "goerli":
        desiredNetworkId = 5;
        break;
      default:
        throw new Error("Invalid network name");
    }
  
    // Switch network if necessary
    if (currentNetworkId !== desiredNetworkId) {
      await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: `0x${desiredNetworkId.toString(16)}` }] });
    }
  }

// start connection
async function init() {
    provider = window.ethereum;
    await provider.enable();
    web3 = await new Web3(provider);
    console.log(web3)
    let accounts = await web3.eth.getAccounts();
    connectedAccount = accounts[0];
    console.log(connectedAccount);
    await switchNetwork(web3, "goerli", provider);
    document.getElementById("connectWallet").value = "Disconnect";
    document.getElementById("connectedAddress").innerHTML = "(".concat(connectedAccount.substring(0, 6)).concat("...").concat(connectedAccount.substr(-4)).concat(")");
}

async function getTwitterID(identifier) {
    const request = await fetch("https://www.idriss.xyz/v1/getTwitterIDDashboard?identifier=" + encodeURIComponent(identifier));
    const response = await request.json();
    return response.twitterID;
}

async function translateTwitter() {
    let twitterName = document.getElementById("twitterHandle").value;
    let userId = await getTwitterID(twitterName);
    return await convert(userId, 'bytes32');
}

const convert = (value, toType) => {
    let output;
    if (toType === 'bytes32') {
        output =  web3.utils.asciiToHex(value);
    }
    if (toType === 'string') {
      output = web3.utils.hexToAscii(value);
    }
    return output;
  };

async function makeAssertion(userId) {
    dataId = userId;
    data = "User with userId " + userId + " has tweeted a verification tweet here: " + tweetURL + ", claiming they own address " + connectedAccount + "."
    // set it automatically on contract level?
    asserter = connectedAccount;

    // make assertion
    await oracle.methods.assertDataFor(dataId, data, asserter).send({ from: connectedAccount })

}

// twitter name
// 1. get id
// 2. translate id to bytes32
// 3. create <h> = hash(userId + address)
// 4. create template tweet content including <h>
// 5. display 4.
// 6. call assert -> makeAssertion



