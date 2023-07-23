const defaultWeb3 = new Web3(new Web3.providers.HttpProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"));
let oracleAddress = "0xA19ea0042E9D39DD530439dDAA9028240E29c267"
let settlementAddress = "0x9923D42eF695B5dd9911D05Ac944d4cAca3c4EAB"
let registryAddress = "0xbF7561af8aba340fCbbc51cf4652DFb1845804DE"
let web3;
let connectedAccount;
let provider;
let oracle;
let settleContract;
let registry;
let userId;
let userHash;
let userTweet;
let assertionId;


// load uma oracle contract
async function loadOracle(w3, oracleAddress) {
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
    return await new w3.eth.Contract(abiOracle, oracleAddress);
}
// load uma oracle contract
async function loadSettleContract(w3, settleAddress) {
    let abiOracle = [{"inputs":[{"internalType":"contract FinderInterface","name":"_finder","type":"address"},{"internalType":"contract IERC20","name":"_defaultCurrency","type":"address"},{"internalType":"uint64","name":"_defaultLiveness","type":"uint64"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract IERC20","name":"defaultCurrency","type":"address"},{"indexed":false,"internalType":"uint64","name":"defaultLiveness","type":"uint64"},{"indexed":false,"internalType":"uint256","name":"burnedBondPercentage","type":"uint256"}],"name":"AdminPropertiesSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"assertionId","type":"bytes32"},{"indexed":true,"internalType":"address","name":"caller","type":"address"},{"indexed":true,"internalType":"address","name":"disputer","type":"address"}],"name":"AssertionDisputed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"assertionId","type":"bytes32"},{"indexed":false,"internalType":"bytes32","name":"domainId","type":"bytes32"},{"indexed":false,"internalType":"bytes","name":"claim","type":"bytes"},{"indexed":true,"internalType":"address","name":"asserter","type":"address"},{"indexed":false,"internalType":"address","name":"callbackRecipient","type":"address"},{"indexed":false,"internalType":"address","name":"escalationManager","type":"address"},{"indexed":false,"internalType":"address","name":"caller","type":"address"},{"indexed":false,"internalType":"uint64","name":"expirationTime","type":"uint64"},{"indexed":false,"internalType":"contract IERC20","name":"currency","type":"address"},{"indexed":false,"internalType":"uint256","name":"bond","type":"uint256"},{"indexed":true,"internalType":"bytes32","name":"identifier","type":"bytes32"}],"name":"AssertionMade","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"assertionId","type":"bytes32"},{"indexed":true,"internalType":"address","name":"bondRecipient","type":"address"},{"indexed":false,"internalType":"bool","name":"disputed","type":"bool"},{"indexed":false,"internalType":"bool","name":"settlementResolution","type":"bool"},{"indexed":false,"internalType":"address","name":"settleCaller","type":"address"}],"name":"AssertionSettled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"bytes","name":"claim","type":"bytes"},{"internalType":"address","name":"asserter","type":"address"},{"internalType":"address","name":"callbackRecipient","type":"address"},{"internalType":"address","name":"escalationManager","type":"address"},{"internalType":"uint64","name":"liveness","type":"uint64"},{"internalType":"contract IERC20","name":"currency","type":"address"},{"internalType":"uint256","name":"bond","type":"uint256"},{"internalType":"bytes32","name":"identifier","type":"bytes32"},{"internalType":"bytes32","name":"domainId","type":"bytes32"}],"name":"assertTruth","outputs":[{"internalType":"bytes32","name":"assertionId","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"claim","type":"bytes"},{"internalType":"address","name":"asserter","type":"address"}],"name":"assertTruthWithDefaults","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"assertions","outputs":[{"components":[{"internalType":"bool","name":"arbitrateViaEscalationManager","type":"bool"},{"internalType":"bool","name":"discardOracle","type":"bool"},{"internalType":"bool","name":"validateDisputers","type":"bool"},{"internalType":"address","name":"assertingCaller","type":"address"},{"internalType":"address","name":"escalationManager","type":"address"}],"internalType":"struct OptimisticOracleV3Interface.EscalationManagerSettings","name":"escalationManagerSettings","type":"tuple"},{"internalType":"address","name":"asserter","type":"address"},{"internalType":"uint64","name":"assertionTime","type":"uint64"},{"internalType":"bool","name":"settled","type":"bool"},{"internalType":"contract IERC20","name":"currency","type":"address"},{"internalType":"uint64","name":"expirationTime","type":"uint64"},{"internalType":"bool","name":"settlementResolution","type":"bool"},{"internalType":"bytes32","name":"domainId","type":"bytes32"},{"internalType":"bytes32","name":"identifier","type":"bytes32"},{"internalType":"uint256","name":"bond","type":"uint256"},{"internalType":"address","name":"callbackRecipient","type":"address"},{"internalType":"address","name":"disputer","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"burnedBondPercentage","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"cachedCurrencies","outputs":[{"internalType":"bool","name":"isWhitelisted","type":"bool"},{"internalType":"uint256","name":"finalFee","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"cachedIdentifiers","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"cachedOracle","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"defaultCurrency","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"defaultIdentifier","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"defaultLiveness","outputs":[{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"assertionId","type":"bytes32"},{"internalType":"address","name":"disputer","type":"address"}],"name":"disputeAssertion","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"finder","outputs":[{"internalType":"contract FinderInterface","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"assertionId","type":"bytes32"}],"name":"getAssertion","outputs":[{"components":[{"components":[{"internalType":"bool","name":"arbitrateViaEscalationManager","type":"bool"},{"internalType":"bool","name":"discardOracle","type":"bool"},{"internalType":"bool","name":"validateDisputers","type":"bool"},{"internalType":"address","name":"assertingCaller","type":"address"},{"internalType":"address","name":"escalationManager","type":"address"}],"internalType":"struct OptimisticOracleV3Interface.EscalationManagerSettings","name":"escalationManagerSettings","type":"tuple"},{"internalType":"address","name":"asserter","type":"address"},{"internalType":"uint64","name":"assertionTime","type":"uint64"},{"internalType":"bool","name":"settled","type":"bool"},{"internalType":"contract IERC20","name":"currency","type":"address"},{"internalType":"uint64","name":"expirationTime","type":"uint64"},{"internalType":"bool","name":"settlementResolution","type":"bool"},{"internalType":"bytes32","name":"domainId","type":"bytes32"},{"internalType":"bytes32","name":"identifier","type":"bytes32"},{"internalType":"uint256","name":"bond","type":"uint256"},{"internalType":"address","name":"callbackRecipient","type":"address"},{"internalType":"address","name":"disputer","type":"address"}],"internalType":"struct OptimisticOracleV3Interface.Assertion","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"assertionId","type":"bytes32"}],"name":"getAssertionResult","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCurrentTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"currency","type":"address"}],"name":"getMinimumBond","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes[]","name":"data","type":"bytes[]"}],"name":"multicall","outputs":[{"internalType":"bytes[]","name":"results","type":"bytes[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"numericalTrue","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"_defaultCurrency","type":"address"},{"internalType":"uint64","name":"_defaultLiveness","type":"uint64"},{"internalType":"uint256","name":"_burnedBondPercentage","type":"uint256"}],"name":"setAdminProperties","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"assertionId","type":"bytes32"}],"name":"settleAndGetAssertionResult","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"assertionId","type":"bytes32"}],"name":"settleAssertion","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"assertionId","type":"bytes32"}],"name":"stampAssertion","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"identifier","type":"bytes32"},{"internalType":"address","name":"currency","type":"address"}],"name":"syncUmaParams","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];
    return await new w3.eth.Contract(abiOracle, settleAddress);
}
// load uma oracle contract
async function loadRegistry(w3, registryAddress) {
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
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "asserter",
            "type": "address"
          }
        ],
        "name": "ReverseRegister",
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
            "name": "",
            "type": "address"
          }
        ],
        "name": "reverseOwners",
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
    return await new w3.eth.Contract(abiRegistry, registryAddress);
}
// load all contracts
async function loadContracts(w3) {
    oracle = await loadOracle(w3, oracleAddress);
    settleContract = await loadSettleContract(w3, settlementAddress);
    registry = await loadRegistry(w3, registryAddress);
}
loadContracts(defaultWeb3);

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
    document.getElementById("connectedAddress").innerHTML = connectedAccount.substring(0, 6).concat("...").concat(connectedAccount.substr(-4));
    document.getElementById("connectWallet").onclick = function () {
        disconnectWallet();
    };
    await loadContracts(web3);

    let reverse = await registry.methods.reverseOwners(connectedAccount).call();
    if (reverse!=="0x0000000000000000000000000000000000000000000000000000000000000000") {
        let twitterName = await getTwitterName(await convert(reverse, 'string'));
        document.getElementById('reverseResult').innerHTML = "@"+twitterName;
        document.getElementById('reverseResultHref').href = "https://twitter.com/"+twitterName;
        document.getElementById('reverseDiv').style.display = "";
    } else {
      document.getElementById('reverseDiv').style.display = "none";
    }
}

async function disconnectWallet() {
    document.getElementById("connectWallet").value = "Connect";
    document.getElementById("connectedAddress").innerHTML = "";
    document.getElementById("connectWallet").onclick = function () {
        init();
    };
}

async function getTwitterID(identifier) {
    const request = await fetch("https://www.idriss.xyz/v1/getTwitterIDDashboard?identifier=" + encodeURIComponent(identifier));
    const response = await request.json();
    return response.twitterID;
}

async function getTwitterName(userId) {
  const request = await fetch("https://www.idriss.xyz/v1/getTwitterNames?ids=" + encodeURIComponent(userId));
  const response = await request.json();
  return response.twitterNames[userId];
}

async function translateTwitter() {
    if (!provider) await init();
    let twitterHandle = document.getElementById("twitterHandle").value;
    document.getElementById("twitterName").innerHTML = twitterHandle;
    let userIdString = await getTwitterID(twitterHandle);
    userId =  await convert(userIdString, 'bytes32');
    // hide input and show tweet content
    userHash = web3.utils.keccak256(userId, connectedAccount);
    console.log(userHash)
    userTweet = "I am verifying my Twitter account: " + userHash
    document.getElementById("tweetContentDiv").style.display = "";
    document.getElementById("tweetContent").innerHTML = userTweet;
    document.getElementById("twitterDiv").style.display = "none";
    const progressBarInner = document.getElementById("progressBarInner");
    progressBarInner.style.width = "40%";
    progressBarInner.innerHTML = "Step 2";
}

async function convert(value, toType) {
    let output;
    if (toType === 'bytes32') {
        output =  web3.utils.asciiToHex(value);
    }
    if (toType === 'string') {
        output = web3.utils.hexToAscii(value);
    }
    return output;
}


async function makeAssertion() {
    dataId = userId;
    let tweetURL = document.getElementById("tweetUrl").value;
    data = "User with userId " + userId + " has tweeted a verification tweet here: " + tweetURL + ", claiming they own address " + connectedAccount + ". userId converted through `web3.utils.asciiToHex({stringUserId})`. Hash verification through web3.utils.keccak256({userId}, {address})."
    // set it automatically on contract level?
    asserter = connectedAccount;

    // make assertion
    let assertionIdTxn = await oracle.methods.assertDataFor(dataId, data, asserter).send({ from: connectedAccount });
    assertionId = assertionIdTxn.events[3].raw.topics[1];
    console.log(assertionId)

    // start 2 min waiting period
    progressBarInner.style.width = "60%";
    progressBarInner.innerHTML = "Step 3";
    document.getElementById("tweetContentDiv").style.display = "none";
    document.getElementById("finishDiv").style.display = "";
    

    // Set the initial countdown value to 60 seconds
    let countdown = 119;
    countdownElem = document.getElementById("timer");

    // Create a function to update the button text with the remaining countdown value
    const updateButtonTextPre = async () => {
        countdownElem.innerHTML = `${countdown}`;

        // Decrement the countdown value
        countdown--;

        // If the countdown has reached 0, re-enable the button and reset the text
        if (countdown < 0) {
            finishCountdown();
            countdownElem.display = "none";
            return;
        } else {
            // Schedule the next update in 1 second
            setTimeout(updateButtonTextPre, 1000);
        }
    };


    // Start the countdown for twitter
    await updateButtonTextPre();

}

async function finishCountdown() {
    document.getElementById("finalCta").innerHTML = "Sign only one more transaction"
    document.getElementById("settleButton").style.display = "";
    progressBarInner.style.width = "80%";
    progressBarInner.innerHTML = "Step 4";
}

async function settle() {
    await settleContract.methods.settleAssertion(assertionId).send({ from: connectedAccount });
    document.getElementById("settleButton").style.display = "none";
    document.getElementById("finalCta").innerHTML = "Verification completed!"
    progressBarInner.style.width = "100%";
    progressBarInner.innerHTML = "100%";
    setTimeout(copyTweet, 5000);
}

function toggleTwitterDiv() {
    var twitterDiv = document.getElementById("twitterDiv");
    if (twitterDiv.style.display === "none") {
      twitterDiv.style.display = "block";
      document.getElementById("progressBarOuter").style.display = "block";
    } else {
      twitterDiv.style.display = "none";
      document.getElementById("progressBarOuter").style.display = "none";
      document.getElementById("finishDiv").style.display = "none";
      document.getElementById("tweetContentDiv").style.display = "none";
    }
  }

async function copyTweet() {
    let content = document.getElementById("tweetContent").innerHTML;
    await navigator.clipboard.writeText(content);
    document.getElementById("tooltip").style.display = "block";
    setTimeout(function () {
        tooltip.style.display = "none";
    }, 1000);
}





