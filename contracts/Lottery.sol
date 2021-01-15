pragma solidity ^0.4.17; //This specifies the version of solidity that our code is written with

contract Lottery { // defines a new contract that will have some number of methods and variables
    
    address public manager; // The variable contains the address of the person who created the contract
    
    address[] public players; //The variable contains the array of adresses of people who have entered the lottery
    
    address public lastWinner;

    function Lottery() public {
        
        // Figures out who created the new contract and assigned the address of their account to the manager variable
        
        manager = msg.sender; // manager records the account's address of the person who is creating the contract
        
        // msg is a global variable that deals with who just sent in the transaction as well as describe the details about the transaction itself
        
        //msg comes along with special properties like .data, .sender, .value, .gas
        
        // msg.data (present on any transaction) contains the data field from the current function invocation (call or transaction)
        
        // msg.gas contains the amount of gas available for the current function invocation (call or transaction)
        
        // msg.sender contains the address of the account that started the current function invocation (call or transaction)
        
        // msg.value contains the amount of ether (in wei) that was sent along with the current function invocation (call or transaction)

    }
    
    function enter() public payable {  // Enter a player into the Lottery [payable because the players have to send along some amount of ether if want to take part in the lottery]
    
        require(msg.value > 0.01 ether); // Used for validation. We pass in a boolean expression to this function. If the boolean function returns false then the entire function is exited immediately with no changes happening in the contract.
        
        players.push(msg.sender); // Once the players send in the money, we make sure that their address added in the array using msg.sender
        
    }
    
    function random() private view returns (uint){  // Private because only the manager who has created the contract has access to it. No one else should be allowed otherwise to call this function.
        
        return uint(sha3(block.difficulty, now, players)); // (sha3 or keccak256)Global function that helps import pseudo-randomness to select the players randomly. Not exactly randomly since it is not possible to code in solidity.
        
        //block.difficulty is a number that will indicate hoe challenging it is going to be to solve the current block
    
        // now is the current time that we pass in as the second argument and is a global variable.
        
        // players is the array that we pass in to randomly select for winner declaration
        
        // The above is a hashing algorithm that returns a hash. We do type casting of this has value to match with the return type.
    }
    
    function pickWinner() public restricted {  // Only the manager should be able to access the function since they are responsible for holding the lottery 
        
        // require(msg.sender == manager); // This ensures that the person who called the function is a manager otherwise exits the process.
        
        uint index = random() % players.length; // index of the array of players variable will be the winner
    
        players[index].transfer(this.balance); // 0x104ad73eh31c347 is the address return for instance. These addresses have some number of methods tied to them. player[index].transfer(x) will transfer x amount of wei to the adress return by the corresponding index 
        
        lastWinner = players[index];    // Displays the winner 

        // 'this' is the reference to the instance of the corrent contract and balance is the amount of money that has been credited into the contract by the players who took part in the lottery 
   
        //------------------------------------------------------------------------------//
        
        // Resetting the players array to start the enxt round of lottery
        
        players = new address[](0); // Created a brand new dynamic array of type address. (0) indicated the initial size of length 0.
   
    }
    
    modifier restricted() {
        
        // Using the modifier keyword, we define a new function modifier to be added into the contract. We solely use them to reduce the amount of code that you and I have to write.
        // If we add 'restricted' name to any of our other functions inside the contract, we may imagine that behind the scenes the code within that function is taken and added under the modifier function in place of the '_;'.
        //This allows us to write one modifier and use them in many places.
        
        require(msg.sender == manager);
        _;
        
    }
    
    function getPlayers() public view returns (address[]) {
        
        return players;
        
    }

    function Winner() public view returns (address) {
        
        return lastWinner;
        
    }
    
}