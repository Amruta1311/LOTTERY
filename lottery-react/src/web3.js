// Here we configure our own local copy of web3 by using the injected copy provided by Metamask 

import Web3 from 'web3';

//COnnect to Metamask

window.ethereum.request({ method: 'eth_requestAccounts' });

let web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');

// const web3 = new Web3(window.web3.currentProvider); // This provider is connected to the rinkeby network and has access to all the accounts, addresses, public, private keys that we may want.

export default web3;