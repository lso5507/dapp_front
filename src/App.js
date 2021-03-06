import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import Loader from './Loading'
import { useEffect, useState } from 'react';


let lotteryAddress = '0xc0Cc692BF7A5D891E0d5217e9AE5FC60ccCb9C76';
let lotteryABI =[ { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "bettor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "indexed": false, "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" } ], "name": "BET", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "bettor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "indexed": false, "internalType": "bytes1", "name": "answer", "type": "bytes1" }, { "indexed": false, "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" } ], "name": "DRAW", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "bettor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "indexed": false, "internalType": "bytes1", "name": "answer", "type": "bytes1" }, { "indexed": false, "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" } ], "name": "FAIL", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "enum Lottery.BlockStatus", "name": "result", "type": "uint8" } ], "name": "NOTMINED", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "bettor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "indexed": false, "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" } ], "name": "REFUND", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "bettor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "indexed": false, "internalType": "bytes1", "name": "answer", "type": "bytes1" }, { "indexed": false, "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" } ], "name": "WIN", "type": "event" }, { "constant": true, "inputs": [], "name": "answerForTest", "outputs": [ { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "internalType": "address payable", "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getPot", "outputs": [ { "internalType": "uint256", "name": "pot", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "bytes1", "name": "challenges", "type": "bytes1" } ], "name": "betAndDistrubute", "outputs": [ { "internalType": "bool", "name": "result", "type": "bool" } ], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "bytes1", "name": "challenges", "type": "bytes1" } ], "name": "bet", "outputs": [ { "internalType": "bool", "name": "result", "type": "bool" } ], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [], "name": "distribute", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "bytes32", "name": "answer", "type": "bytes32" } ], "name": "setAnswerForTest", "outputs": [ { "internalType": "bool", "name": "result", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "internalType": "bytes32", "name": "answer", "type": "bytes32" } ], "name": "isMatch", "outputs": [ { "internalType": "enum Lottery.BettingResult", "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "pure", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "uint256", "name": "index", "type": "uint256" } ], "name": "getBetInfo", "outputs": [ { "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" }, { "internalType": "address", "name": "bettor", "type": "address" }, { "internalType": "bytes1", "name": "challenges", "type": "bytes1" } ], "payable": false, "stateMutability": "view", "type": "function" } ]



function App() { 
  const [winRecords,setwinRecords] = useState([]);
  const [drawRecords,setDrawRecords] = useState([]);
  const [betRecords,setBetRecords] = useState([]);
  const [failRecords,setFailRecords] = useState([]);
  const [pot,setPot] = useState('0');
  const [challenges,setchallenges] = useState(['A','B']);
  const [test,setTest]=useState('test');
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
    const time =  setInterval(pollData,2000)
      return ()=> clearInterval(time)  //componentWillUpdate ??????????????? setinterval????????? ?????????????????? ??? ?????? clear
  },[finalRecords]);
   const getAccounts= async()=>{
     const account = await window.web3.eth.getAccounts();
     return account
     
      
   }
   const getBalance= async(account)=>{
    const Balance = await window.web3.eth.getBalance(account);
    console.log(Balance) 
     return Balance;
  }
  const pollData = async()=>{
    console.log(window.connection)
      //?????? ????????? ?????? ?????? ?????? ?????????
      
      getPot()
      //  getBetEvent(window.connection)
      //  .then(getFailEvent(window.connection))
      //  .then(getWinEvent(window.connection) )
      //  .then(makeFinalRecords())
      //  .then(()=>{console.log(betRecords)})
         // TrubleShooting -> ??? Event???????????? ?????????????????? FinalRecords??? ??????????????? ?????? ?????? ?????????????????? ??????????????? ??????.
    
      await getBetEvent(window.connection)
      await getFailEvent(window.connection)
      await getWinEvent(window.connection)
      await getDrawEvent()
      makeFinalRecords();
      
      //===============================
  }
   const initWeb3 = async ()=>{
     
     // Recent Dapp
    if (window.ethereum) {
      console.log('RECENT Module ')
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
    // ?????? ??? ?????? 
    const account = await window.web3.eth.getAccounts()
    window.account=account;
    console.log(account[0])
    // ?????? ???????????? ?????? window ????????? ?????? ?????? redux ?????? ???
    window.connection =  await new window.web3.eth.Contract(lotteryABI,lotteryAddress)
    // source ?????? ??????(window)
    const connection = window.connection;

    setLoading(false); 
    
    let pot =  await connection.methods.getPot().call();
    console.log(pot)
    let owner =  await connection.methods.owner().call();
    console.log(owner)
    
    // connection.methods.betAndDistrubute('0xcd').send({from:account[0], value:5000000000000000,gas:300000})
    //bet(account[0],connection)
    //eventLOG Filter

  }
  const bet = async (connection)=>{
    //nonce==TranSaction Counting
    // ?????? ??????
    let challenge  = '0x' + challenges[0].toLowerCase()+challenges[1].toLowerCase()   
    //??????????????? nonce??? ????????? ???????????? ??? ?????? ????????? ????????? ????????? ???????????????. 
    let nonce =await window.web3.eth.getTransactionCount(window.account[0])  //web3?????? ????????? ????????? ?????????{????????? ??????}e
    console.log("nonce!!::::",nonce)
     connection.methods.betAndDistrubute(challenge).send({from:window.account[0], value:5000000000000000,gas:300000,nonce:nonce})


  }

  const makeFinalRecords = ()=>{

      let f = 0,w=0,d=0;

      let records = [...betRecords]   //?????? ?????????. setState????????? ?????? betRecords??? ???????????? ????????? ????????? ???
      
      for(let i=0; i<betRecords.length;i++){
        if(winRecords.length>0 && betRecords[i].index === winRecords[w].index){
          records[i].win = 'WIN'
          records[i].answer = records[i].challenge;
          records[i].pot = window.web3.utils.fromWei(winRecords[w].amount,'ether');
          if(winRecords.length -1 >w) w++ // winRecord??? 1 ???????????? records????????? 2?????? ?????? winRecord?????? ?????? ??????
        } else if(failRecords.length>0 && betRecords[i].index === failRecords[f].index){
            records[i].win = 'FAIL'
            records[i].answer = failRecords[f].answer;
            records[i].pot = 0; 
            if(failRecords.length -1 >f) f++ // winRecord??? 1 ???????????? records????????? 2?????? ?????? winRecord?????? ?????? ??????
          }else if(drawRecords.length>0 && betRecords[i].index === drawRecords[d].index){
            records[i].win = 'DRAW'
            records[i].answer = records[i].challenge;
            records[i].pot = window.web3.utils.fromWei(winRecords[w].amount,'ether');
            if(winRecords.length -1 >d) d++ // winRecord??? 1 ???????????? records????????? 2?????? ?????? winRecord?????? ?????? ??????
          } else{
            records[i].answer = 'Not Revealed';
          }
      }
   
       setfinalRecords(records);
  }
  const getPot =  async ()=>{
      let  potData = await window.connection.methods.getPot().call();
     
      let potString = window.web3.utils.fromWei(potData.toString(),'ether')

      setPot(potString)
      
  }
  const getBetEvent = async(connection)=>{
    console.log('getBet')
    let records = []; 
     
    const events= await window.connection.getPastEvents('BET',{fromBlock:0, toBlock :'latest'})
    for(let i=0;i<events.length;i++){
      const record = {}
      record.index = parseInt(events[i].returnValues.index,10).toString()
      record.bettor =events[i].returnValues.bettor;
      record.betBlockNumber = events[i].returnValues.betBlockNumber;
      record.targetBlockNumber= events[i].returnValues.answerBlockNumber.toString();
      record.challenges = events[i].returnValues.challenges;
      record.win ='Not Revealed';
      record.answer = '0x00'
      records.unshift(record)

    }

    setBetRecords(records)




  }

  const getWinEvent = async(connection)=>{
    console.log('getWin')
    let records = []; 
     
    const events= await window.connection.getPastEvents('WIN',{fromBlock:0, toBlock :'latest'})
    for(let i=0;i<events.length;i++){
      const record = {}
      record.index = parseInt(events[i].returnValues.index,10).toString()
      record.amount = parseInt(events[i].returnValues.amount,10).toString()
      records.unshift(record)

    }
    
    setwinRecords(records)

  }
  const getDrawEvent = async()=>{
    console.log('getDraw')
    let records = []; 
     
    const events= await window.connection.getPastEvents('DRAW',{fromBlock:0, toBlock :'latest'})
    for(let i=0;i<events.length;i++){
      const record = {}
      record.index = parseInt(events[i].returnValues.index,10).toString()
      record.amount = parseInt(events[i].returnValues.amount,10).toString()
      records.unshift(record)

    }
    
    setDrawRecords(records)

  }
  
  const getFailEvent = async(connection)=>{
   
    let records = []; 

     
    const events= await window.connection.getPastEvents('FAIL',{fromBlock:0, toBlock :'latest'})
    for(let i=0;i<events.length;i++){
      const record = {}
      record.index = parseInt(events[i].returnValues.index,10).toString()
      record.answer = events[i].returnValues.answer

      records.unshift(record)

    }
    //console.log('failrecords:::',records)
    setFailRecords(records)
  }
  


  //Pot Money

  
  //bet ???????????? UI(????????????)
  
  
  //Bet Button


  //Histroy table


  if (loading) return <Loader type="spin" color="RGB ???" message={"Loading..."} />;
  const onClickCard = (_char)=>{
    setchallenges([challenges[1],_char])
  }
  const getCard=(_character, _cardStyle) =>{

    let card =``;
    if(_character === 'A'){
      card='????';
    }
    else if(_character ==='B'){
      card='????'
    }
    else if(_character ==='C'){
      card='????'
    }
    else if(_character ==='0'){
      card='????'
    }
    return (
      <button onClick={()=>onClickCard(_character)} className={_cardStyle}>
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
          {getCard('0','card bg-success')}
        </div>
      </div>
      <div className="container">
        <br></br>
        <button onClick={()=>bet(window.connection)} className="btn btn-danger btn-lg">BET!</button>
      </div> 
      <br></br>
      <div className="container">
        <div>
          <h1>testArea</h1>
         {/* <p> {betRecords[0].bettor}</p>  */}
        </div>
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
                  <td>{record.index}</td>
                  <td>{record.bettor}</td>
                  <td>{record.challenges}</td>
                  <td>{record.answer}</td>
                  <td>{record.pot}</td>
                  <td>{record.win}</td>
                  <td>{record.targetBlockNumber}</td>

                </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
      <div>

        </div>

    </div>


  );
}

export default App;
