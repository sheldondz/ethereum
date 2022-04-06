import logo from './logo.svg';
import './App.css';
import React  from "react";
import { ethers } from "ethers";
import Wave from "./artifacts/contracts/Wave.sol/Wave.json";
import Message from "./components/Message";

export default class App extends React.Component {
   constructor(props) {
       super(props);
       this.state = {
           contractAddress: "0xa47287c71736EBA045f05e11b169E3187AE670cf",
           waveCount: 0,
           newMessage: "",
           currentMessage:"",
           waves: [],
       }
   }

   getAccounts =  async () =>{
       await window.ethereum.request({method:"eth_requestAccounts"});
   }

   getTotalWaves = async () =>{
       const provider = new ethers.providers.Web3Provider(window.ethereum);
       console.log(ethers.Wallet.createRandom());
       const contract = new ethers.Contract(this.state.contractAddress, Wave.abi, provider);
       const totalWaves = await contract.totalWaves();
       console.log(totalWaves.toNumber());
       this.setState({waveCount: totalWaves.toNumber()});
       const waves = await contract.getMessages();
       this.setState({waves: waves});
   }

   wave = async() =>{
        await this.getAccounts();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const user =  provider.getSigner();
        const contract = new ethers.Contract(this.state.contractAddress, Wave.abi, user);
        contract.on("NewWave",( from, timestamp, message) =>{
           console.log(from, timestamp, message);
        })
        contract.on("NewReward",( to ) =>{
           console.log("Reward transferred to ",to);
           this.setState({rewarded: to});
        })
        let txn = await contract.connect(user).wave(this.state.newMessage);
        await txn.wait();
        await this.getTotalWaves();
   }

    reward = async() =>{
        await this.getAccounts();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(this.state.contractAddress, Wave.abi, signer);
        const txn = await contract.reward();
        await txn.wait();
    }

   render() {
   const items = this.state.waves.map(item => {
       return (
           <Message
               key={item.id}
               item={item}
           />
       )
   })
     return (
            <main>
                <div className="form">
                    <input type="text"  className="form--input"
                           onChange={e=>{this.setState({newMessage:e.target.value})}}/>
                    <button onClick={this.wave} className="form--button">Wave</button>
                    <button onClick={this.getTotalWaves} className="form--button">Get Total Waves</button>
                    <button onClick={this.reward} className="form--button">Process Reward</button>
                </div>
                <h2>Total waves: {this.state.waveCount}</h2>
                <h2>Winner: {this.state.rewarded}</h2>
                {items}
            </main>
     )
   }
}
