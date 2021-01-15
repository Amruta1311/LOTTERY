import web3 from './web3';

const address = '0x0F7B5b4f19bf68F480fd86F62F983e8EC27800e2'; // address of the contract deployed in the blockchain network

const abi = [{"constant":true,"inputs":[],"name":"manager","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"pickWinner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getPlayers","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"Winner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"enter","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"players","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastWinner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];

// We take the above defined address and the abi and create a local contract instance using the web3 library

// A local contract instance means that we make an object that exists only inside of our browser, that kind of functions as an abstraction or a representation of our deployed contract

// Therefore the object we are going to create is not the actual contract that exists on the blockchain

//The object created is a local javascript only copy that is meant to represent what is actually occuring on the blockchain

export default new web3.eth.Contract(abi, address);

// The above line of code is simply an access to our contract that actually exists on the blockchain