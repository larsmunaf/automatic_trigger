const fs = require ('fs');
const Web3 = require ('web3');
const solc = require ('solc');
const anomalyScoreSenderSol = fs.readFileSync ('../contracts/anomaly_score_sender.sol', 'utf-8');

module.exports = function (callback) {
    var provider = new Web3.providers.WebsocketProvider ('ws://localhost:8546'),
        web3 = new Web3 (provider),
        account,
        compiledContract,
        compiledContractAbi,
        compiledContractInstance,
        randAnomalyScore;

    var compilerInput = {
        language: "Solidity",
        sources: {
            'MyContract': {
                content: anomalyScoreSenderSol
            }
        },
        settings: {
            outputSelection: {
	    	"*": {
        	    "*": ["*"]
      		}
	    }
        }
    };
    
    console.log ('started...');
    console.log ('file: ', anomalyScoreSenderSol);
    console.log ('compiler input:', JSON.stringify (compilerInput));

    /* set account, compile and execute our contract */
    web3.eth.getAccounts ().then (function (accounts) {
        account = accounts[0]; // deprecated, addresses must be used instead
    }).then (function () {
        compiledContract = JSON.parse (solc.compile (JSON.stringify(compilerInput)));
	    console.log ('abi: ', JSON.stringify (compiledContract.contracts['MyContract']['AutomaticHealing'].abi));
	    console.log ('bin: ', compiledContract.contracts['MyContract']['AutomaticHealing'].evm.bytecode.object);
    }).then (function () {
        compiledContractAbi = compiledContract.contracts['MyContract']['AutomaticHealing'].abi;
	    compiledContractBin = compiledContract.contracts['MyContract']['AutomaticHealing'].evm.bytecode.object;
        fs.writeFileSync('../build/contracts/AutomaticHealing.json', JSON.stringify(compiledContract.contracts));
        compiledContractInstance = new web3.eth.Contract(compiledContractAbi, '0xBb315A9a14DA97f8171Eb4FB1c41B524C2fe921B'); // use fixed address
        compiledContractInstance.deploy ({
	        data: '0x' + compiledContractBin
	    }).send({
	        from: account
        })
        .on ('error', (err) => {console.log (err)})
	    .on ('transactionHash', (transactionHash) => {console.log ('hash: ', transactionHash)})
	    .on ('receipt', (receipt) => {console.log ('receipt: ', receipt.contractAddress)})
	    .on ('confirmation', (confirmationNumber, receipt) => {console.log ('confirmationNumber: ', confirmationNumber)})
	    .then ((newContractInstance) => {
		    console.log ('newInstance:', newContractInstance);
	        //compiledContractInstance.options.address = newContractInstance.options.address
		    setInterval (setAnomalyScore, 2000);

		    function setAnomalyScore () {
        		randAnomalyScore = Math.round (Math.random () * (200 - 0) + 0);
        		newContractInstance.methods.writeScoreIntoBlockchain (randAnomalyScore).send ({
            			from: account
        		}).on ('error', (err) => {console.log (err)});
        		console.log ('wrote anomaly score');
    		}
	    }).catch ('error', (err) => {console.log (err)});
    })
};

module.exports ();