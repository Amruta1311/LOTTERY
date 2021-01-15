import React, {Component} from 'react';
import './App.css';
import web3 from './web3';
import lottery from './lottery';
 
class App extends Component {

  // console.log(web3.version);

  // web3.eth.getAccounts().then(console.log); // whatever the function getAccounts retrieves will be automatically logged to the console.

  // we do not use async here since it is not compactible with the render method

  // constructor(props) { 
  //   super(props);
 
  //   this.state = { manager: ''};
  // }

  state = {

    manager: '',
    players: [],
    balance: '',
    value: '', // text inputs are always going to be empty inputs thus value is an empty string
    message: '',
    winner: ''

  };        // An equivalent code of the contructor commented to concise the code.
 
  async componentDidMount(){ //Automatically called whenever the app component is placed on the screen
    
    const manager = await lottery.methods.manager().call();  // whenever we are in the ethereum world of the react application and we are making use of the metamask provider (copy) of web3 rather than our own provider (copy) of web3, we dont actually have to specify where the call is coming from. This is because when we are making use of the metamask provider, we dont have to specify the from field since this copy of web3 with the provider has a default account already set and it is going to be the first account that we are signed into inside of metamask. 
    
    const players = await lottery.methods.getPlayers().call(); // Returns the array of addresses that every player has entered

    const balance = await web3.eth.getBalance(lottery.options.address); // Returns the balance of the lottery by accessing the address of the contract. This gives the total balance of the corresponding contract

    this.setState({ manager: manager});  // this.setState({ manager });  <== CONCISE FORM

    this.setState({players: players});  // this.setState({ players });  <== CONCISE FORM

    this.setState({balance: balance});  // this.setState({ balance });  <== CONCISE FORM

//=== this.setState({ manager, players, balance }); <---( THE ABOVE 3 LOC CAN BE WRITTEN IN ONE LINE AS SHOWN HERE) ===//
  
  }

  onSubmit = async(event) => {   // We define a method on the class without worrying us about the value of 'this' inside the function as we normally would in case of a method. 'this' will be automatically set to be equal to our component. This is exactly what we want

  // We pass event object as argument that represents the form submission

  event.preventDefault();  //To make sure the form does not attempt to submit itselfin the classic html way

  const accounts = await web3.eth.getAccounts();

  this.setState({message: 'Waiting on Transaction Success ...'});

  // We assume accounts[0] is going to be the account that will be sending the transaction

  await lottery.methods.enter().send({
    from: accounts[0],   //Assuming the first address inside the list of account is going to be used to enter the lottery
    value: web3.utils.toWei(this.state.value, 'ether')       //This is the amount of money that we want to enter into the lottery contract
  });

  this.setState({message: 'You have been Entered!'});

  };


  onCLick = async () => {

    const accounts = await web3.eth.getAccounts();

    this.setState({message: 'Waiting on Transaction Success ...'});

    await lottery.methods.pickWinner().send({
      from: accounts[0]  // Specify who is sending in the transaction or the source account
    });

    const winner = await lottery.methods.Winner().call();

    this.setState({winner: "The Winner is: " + winner});

    this.setState({message: 'A Winner has been Picked!'});
  };

 
  render(){
    return (
      <div className="App">
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {this.state.manager}.
        </p>
        <p>
          There are currently {this.state.players.length} people entered,
        </p>
        <p>
          competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!
        </p>

        <hr/>

        <form onSubmit={this.onSubmit}> {/* Added a event handler with the function defined outside the render method and is used to call the lottery contract*/}
          <h4>WANT TO TRY YOUR LUCK?</h4>
          <div>
            <label> Amount of ether to enter :   </label>
            <input
              value = {this.state.value}  //We set the value of the input in the 'value' 

              onChange={event => this.setState({ value: event.target.value })} // onChange will be called anytime when someone changes the text in the input and then it updates the property that holds the amount of ether the player wants to contribute

            />
          </div>
          <p></p>
          <button>Enter</button>
        </form>

        <hr />
        <h4>Ready To Pick A Winner?</h4>
        <button onClick={this.onCLick}>Pick A Winner</button>
        <hr />

        <h1>{this.state.message}</h1>
        <h2>{this.state.winner}</h2>
        
      </div>
    );
  }
}
 
export default App;


/*

//----------------------ALTERNATE SOLUTION------------------------------------//

import React from 'react';
import './App.css';
import lottery from './lottery';
import Async from 'react-async';
import { useAsync } from 'react-async';
 
const loadManager = () =>
   lottery.methods.manager().call() // whenever we are in the ethereum world of the react application and we are making use of the metamask provider (copy) of web3 rather than our own provider (copy) of web3, we dont actually have to specify where the call is coming from. This is because when we are making use of the metamask provider, we dont have to specify the from field since this copy of web3 with the provider has a default account already set and it is going to be the first account that we are signed into inside of metamask. 
 
function App() {
  const { data, error, isLoading } = useAsync({ promiseFn: loadManager })
  if (isLoading) {
      return "Loading..."
  }
  if (data) {
    return (
    <div className="App">
      <h2>Lottery Contract</h2> 
       <p>This contract is managed by {data}</p>
    </div>
    ); 
   }
}
 
export default App;
 */
