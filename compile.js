const path = require('path');  // The path module helps to build a path like a directory 
                               // path from current compile.js file over to the inbox.sol file

const fs = require('fs');  // file system module that helps to read in the contents of the file

const solc = require('solc');

const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol'); //gives the specific path for compilation
// __dirname that from the home directory to the current directory and then we specify the path from
// the current directory to the file where we want the compilation to be done.
// inboxPath contains the proper path of the file we want to compile

// Given the path, now we read in the contents of the file.
const source = fs.readFileSync(lotteryPath, 'utf8');

// ----->    console.log(solc.compile(source, 1));    <----- execute on the terminal using command "node compile.js" //The second arguement defines the number of different contracts that we want to compile

module.exports = solc.compile(source, 1).contracts[':Lottery'];  // This exports the compiled list to other files 
                                                     // in the directory to have access to contracts object

//The contract we are exporting from this file has two properties assigned to it in particular.
// One is called interface and the other is bytecode. The property interface is the javascript API
// and the bytecode is the actual raw compiled contract.