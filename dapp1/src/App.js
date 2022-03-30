import logo from './logo.svg';
import './App.css';
import Greeting from "./artifacts/contracts/Greeter.sol/Greeter.json"
import { ethers } from "ethers";
import React from "react";
import Web3Modal from "web3modal";

export default class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            greeting: "Hello",
            contractAddress: "0xDA6DBcf9052A98C1f514B1e63fbD8bAcc7F1cd03",
        }
    }

    getAccounts = async () => {
        await window.ethereum.request({method:"eth_requestAccounts"});
    }

    fetchGreeting = async () => {
        if(typeof window.ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(this.state.contractAddress, Greeting.abi, provider);
            try {
                const greeting = await contract.greet();
                console.log(greeting);
            }catch (err) {
                console.log(err)
            }
        }
    }

    setGreeting = async () => {
        await this.getAccounts();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new  ethers.Contract(this.state.contractAddress, Greeting.abi, signer);
        const transaction = await contract.setGreeting(this.state.greeting);
        await transaction.wait();
    }

    render() {
        return (
            <div className="App">
                <button onClick={this.fetchGreeting}>Fetch Greeting</button>
                <button onClick={this.setGreeting}>Set Greeting</button>
                <input type="text"  onChange={e=>{this.setState({greeting: e.target.value})}}/>
            </div>
        );
    }
}
