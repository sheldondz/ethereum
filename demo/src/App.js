import logo from './logo.svg';
import './App.css';
import React from "react";
import { ethers } from "ethers";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json"

export default class App extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
             greeting: "Hi there",
             contractAddress:"0x5FbDB2315678afecb367f032d93F642f64180aa3"
        }
      }

     getAccounts = async () => {
          await window.ethereum.request({method:"eth_requestAccounts"});
     }

     getGreeting = async() => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(this.state.contractAddress,Greeter.abi,provider);
        const data = await contract.greet();
        console.log(data);
     }

     setGreeting = async() => {
         await this.getAccounts();
         const provider = new ethers.providers.Web3Provider(window.ethereum);
         const signer = provider.getSigner();
         const contract = new ethers.Contract(this.state.contractAddress, Greeter.abi,signer);
         const transaction = await contract.setGreeting(this.state.greeting);
         await transaction.wait();
     }

     render() {
       return(
           <div>
             <button onClick={this.getGreeting}>Get Greeting</button>
             <button onClick={this.setGreeting}>Set Greeting</button>
             <input type="text"  onChange={e =>this.setState({greeting: e.target.value})}/>
           </div>
       )
     }
}

