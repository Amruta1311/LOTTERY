const assert = require('assert');

const ganache = require('ganache-cli');

const Web3 = require('web3');

const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require('../compile');

let lottery;  //holds the instance of contract

let accounts;  // accounts on the network

beforeEach(async () => {

    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas:'1000000' })

});

describe('Lottery Contract', () => {

    it('deploys a contract', () => {
        
        assert.ok(lottery.options.address);

    });

    it('allows one account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],  // who is attempting to enter
            value: web3.utils.toWei('0.02', 'ether')  // need to make sure we send some amount of money by specifying the value property in wei
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]  // specifies who is calling the function
        });

        assert.equal(accounts[0], players[0]);

        assert.equal(1,players.length);

    });


    it('allows multiple accounts to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],  // who is attempting to enter
            value: web3.utils.toWei('0.02', 'ether')  // need to make sure we send some amount of money by specifying the value property in wei
        });

        await lottery.methods.enter().send({
            from: accounts[1],  // who is attempting to enter
            value: web3.utils.toWei('0.02', 'ether')  // need to make sure we send some amount of money by specifying the value property in wei
        });

        await lottery.methods.enter().send({
            from: accounts[2],  // who is attempting to enter
            value: web3.utils.toWei('0.02', 'ether')  // need to make sure we send some amount of money by specifying the value property in wei
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]  // specifies who is calling the function
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);

        assert.equal(3,players.length);

    });

    it('requires a minimum amount of ether', async () => {
        
        try {

            await lottery.methods.enter().send({
                from: accounts[0],
                value: 0
            });

            assert(false); // if we reach this line of code, we recieve an error to report 

        }
        catch(err) {

            assert(err);  //upon npm run test, catch statement will be running since we have not passed sufficient amount of ether in the try statement

        }
        
    });

    it('only manager can call pickWinner', async () => {

        try {
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });

            assert(false);  // If we reach at this part of the code then we have an error andwe run this statement to deliberately output the error mssage

        }

        catch(err) {
            assert(err);  // The test comes here then it is successful since the account[1] is not a manager and does not have access to the pickWinner function
        }

        

    });


    it('sends money to the winner and resets the players array', async () => {

        await lottery.methods.enter().send({
           from: accounts[0],  //The person who is going to enter into the contract
           value: web3.utils.toWei('2','ether') //minimum amount of money that is sent to the lottery contract
        });

        const initialBalance = await web3.eth.getBalance(accounts[0]); // This is a function that will return the amount of ether in units of Wei that a given account controls

        await lottery.methods.pickWinner().send({ from: accounts[0] }); // Since only one account has so far entered in, that particular account is going to be a winner on calling the pickWinner function
        
        const finalBalance = await web3.eth.getBalance (accounts[0]);

        // The difference between initial balance and final balance will not be exactly 2 ether. When doing a 
        // transaction into the network, we have to pay some amount of gas to get that transaction to be processed by that network
        // We have also spent some amount of money on gas. So the difference bertween the two transaction is going to be slightly less than two ether

        const difference = finalBalance - initialBalance;

        //      console.log(difference);

        assert(difference > web3.utils.toWei('1.8', 'ether')); // slightly less than 2

    });


});