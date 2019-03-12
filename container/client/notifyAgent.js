const net = require('net');
const Web3 = require('web3');
var path = require('path'),
    TrackingContractJSON = require(path.join(__dirname, '../tracking_chain/build/contracts/PositionTracking.json'));

module.exports = function (callback) {
    var provider = new Web3.providers.WebsocketProvider('ws://localhost:8546');//.IpcProvider('/home/telekom/Library/Ethereum/geth.ipc', net);
    var web3 = new Web3(provider);
    var account;
    var contract;

    accounts = web3.eth.getAccounts()
        .then(function (accounts) {
            account = accounts[1]; // deprecated; addresses should be used
        }).then(function () {
            contract = new web3.eth.Contract(TrackingContractJSON.abi, TrackingContractJSON.networks['15'].address);
        }).then(function () {
            contract.events.PositionValue({
            }, function (error, event) {
                if (error) console.log("error", error);
            })
                .on('data', function (event) {
                    console.log("x:", event.returnValues['1']); // same results as the optional callback above
                    console.log("y:", event.returnValues['2'], "\n");
                })
                .on('changed', function (event) {
                    console.log("changed", event);
                    // remove event from local database
                })
                .on('error', function (event) {
                    console.log("error 2", event);
                })

            contract.methods.notify().send({
                from: account
            }).catch (function (err) {
                console.log (err);
            });
        }).catch((e) => {
            console.error(e);
        });
};

module.exports();
