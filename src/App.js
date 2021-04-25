import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import Loader from './Loading'
import { useEffect, useState } from 'react';


let lotteryAddress = '0x273e9979db912d8e4476737Bc43D7ff8dACD07B4';
let lotteryABI =[ { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "bettor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "indexed": false, "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" } ], "name": "BET", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "bettor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "indexed": false, "internalType": "bytes1", "name": "answer", "type": "bytes1" }, { "indexed": false, "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" } ], "name": "DRAW", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "bettor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "indexed": false, "internalType": "bytes1", "name": "answer", "type": "bytes1" }, { "indexed": false, "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" } ], "name": "FAIL", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "enum Lottery.BlockStatus", "name": "result", "type": "uint8" } ], "name": "NOTMINED", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "bettor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "indexed": false, "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" } ], "name": "REFUND", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "bettor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "indexed": false, "internalType": "bytes1", "name": "answer", "type": "bytes1" }, { "indexed": false, "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" } ], "name": "WIN", "type": "event" }, { "constant": true, "inputs": [], "name": "answerForTest", "outputs": [ { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "internalType": "address payable", "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getPot", "outputs": [ { "internalType": "uint256", "name": "pot", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "bytes1", "name": "challenges", "type": "bytes1" } ], "name": "betAndDistrubute", "outputs": [ { "internalType": "bool", "name": "result", "type": "bool" } ], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "bytes1", "name": "challenges", "type": "bytes1" } ], "name": "bet", "outputs": [ { "internalType": "bool", "name": "result", "type": "bool" } ], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [], "name": "distribute", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "bytes32", "name": "answer", "type": "bytes32" } ], "name": "setAnswerForTest", "outputs": [ { "internalType": "bool", "name": "result", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "internalType": "bytes32", "name": "answer", "type": "bytes32" } ], "name": "isMatch", "outputs": [ { "internalType": "enum Lottery.BettingResult", "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "pure", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "uint256", "name": "index", "type": "uint256" } ], "name": "getBetInfo", "outputs": [ { "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" }, { "internalType": "address", "name": "bettor", "type": "address" }, { "internalType": "bytes1", "name": "challenges", "type": "bytes1" } ], "payable": false, "stateMutability": "view", "type": "function" } ]


function App() {
  const [winRecords,setwinRecords] = useState([]);
  const [betRecords,setBetRecords] = useState([]);
  const [failRecords,setFailRecords] = useState([]);
  const [pot,setPot] = useState('0');
  const [challenges,setchallenges] = useState(['A','B']);
  const [finalRecords,setfinalRecords] = useState([{
    bettor:'0xabcd...',
    index:'0',
    challenges:'ab',
    answer:'ab',
    targetBlockNumber:'10',
    pot:'0'
  }]);

  const [loading,setLoading] = useState(true)
  useEffect(()=>{
    
    initWeb3()
  },[]);
   const getAccounts= async()=>{
     const account = await window.web3.eth.getAccounts();
     return account
     
      
   }
   const getBalance= async(account)=>{
    const Balance = await window.web3.eth.getBalance(account);
    console.log(Balance) 
     return Balance;
  }

   const initWeb3 = async ()=>{
     
     // Recent Dapp
    if (window.ethereum) {
      console.log('RECENT Module')
      window.web3 = new Web3(window.ethereum);
      //Legacy Code
      //window.ethereum.enable();
      //Recent Code
      window.ethereum.send('eth_requestAccounts')
      
    }
    // Legacy Dapp
    else if (window.web3){
      window.web3 = new Web3(window.web3.currentProvider);
      console.log("Legacy Module");
    //  window.web3.eth.sendTransaction({})
    }
    const account = await window.web3.eth.getAccounts()
    console.log(account[0])
    const connection =  await new window.web3.eth.Contract(lotteryABI,lotteryAddress)
    
    setLoading(false); 
    
    let pot =  await connection.methods.getPot().call();
    console.log(pot)
    let owner =  await connection.methods.owner().call();
    console.log(owner)
    
    // connection.methods.betAndDistrubute('0xcd').send({from:account[0], value:5000000000000000,gas:300000})
    bet(account[0],connection)
    //eventLOG Filter
    getBetEvent(connection);
  }
  const bet = async (account,connection)=>{
    //nonce==TranSaction Counting
    console.log(account)
    let nonce =await window.web3.eth.getTransactionCount(account)
    // connection.methods.betAndDistrubute('0xcd').send({from:account, value:5000000000000000,gas:300000,nonce:nonce})
    console.log("bet")

  }
  const getBetEvent = async(connection)=>{
    console.log("test")
    let records = [];
     
    const events= await connection.getPastEvents('BET',{fromBlock:0, toBlock :'latest'})
    console.log(events)
  }

  //Pot Money

  
  //bet 글자선택 UI(버튼형식)
  
  
  //Bet Button


  //Histroy table

  
  if (loading) return <Loader type="spin" color="RGB 값" message={"Loading..."} />;

  const getCard=(_character, _cardStyle) =>{

    let card =``;
    if(_character === 'A'){
      card='🂡';
    }
    else if(_character ==='B'){
      card='🂱'
    }
    else if(_character ==='C'){
      card='🃁'
    }
    else if(_character ==='D'){
      card='🃑'
    }
    return (
      <button className={_cardStyle}>
        <div className="card-body text-center">
          <p className="card-text"></p>
          <p className="card-text text-center" style={{fontSize:300}}>{card}</p>
          <p className="card-text"></p>

        </div>
    </button>
    )
  }
  return (


    <div className="App">
      <div className="container">
      {/* Header - Pot , Betting characters  */}
        <div className="jumbotron">
          <h1>Current Pot : {pot}</h1>
          <p>Lottery</p>
          <p>Lottery Tutorial</p>
          <p>Your Bet</p>
          <p>{challenges[0]}  {challenges[1]}</p>
        </div>
      </div>
    {/* Card section */}
      <div className="container">
        <div className="card-group">
          {getCard('A','card bg-primary')}
          {getCard('B','card bg-warning')}
          {getCard('C','card bg-danger')}
          {getCard('D','card bg-success')}
        </div>
      </div>
      <div className="container">
        <br></br>
        <button className="btn btn-danger btn-lg">BET!</button>
      </div> 
      <br></br>
      <div className="container">
        <table className="table table-dark table-striped">
          <thead>
            <tr>
              {/* index address challenge answer pot status answerBlockNumber */}
              <th>Index</th>
              <th>Address</th>
              <th>challengedex</th>
              <th>Answer</th>
              <th>Pot</th>
              <th>Status</th>
              <th>AnswerBlockNumber</th>

            </tr>
          </thead>
          <tbody>
            {
              finalRecords.map((record,index)=>{
                return(
                <tr key={index}>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>

                </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
