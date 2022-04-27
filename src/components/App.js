import React, { Component } from 'react';
import logo from '../logo.png';

import Web3 from 'web3';
import './App.css';
import Navbar from './Navbar';
import FundRaiser from '../abis/FundRaiser.json';
import Main from './Main';

class App extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      IdCount: 0,
      campaigns: [],
      loading: true
    }
    this.createCampaign = this.createCampaign.bind(this)
    this.Donate = this.Donate.bind(this)

  }

  createCampaign(_title, _description, _requiredamount) {
    this.setState({ loading: true })
    this.state.fundraiser.methods.createCampaign(_title, _description, _requiredamount).send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
      })
  }

  Donate(id, price) {
    this.setState({ loading: true })
    this.state.fundraiser.methods.Donate(id).send({ from: this.state.account, value: price })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
      })
  }

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  //to load web3
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3

    //load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    let balance = await web3.eth.getBalance(this.state.account)
    console.log(balance,'this is the balance')
    balance = (balance/(10**18)).toFixed(2)
    this.setState({balance})

    const netid = await web3.eth.net.getId()
    //to get 5777 as network id in our case , just dynamic approach
    console.log(netid,'here it is')

    const networkData = FundRaiser.networks[netid]
    if (networkData) {
      const fundraiser = web3.eth.Contract(FundRaiser.abi, networkData.address)
      console.log(fundraiser,'smart contract is here')
      this.setState({ fundraiser })

      //product count

      const IdCount = await fundraiser.methods.IdCount().call()
      console.log(IdCount.toString(),'this is product count')
      this.setState({ IdCount })

      for (var i = 0; i < IdCount; i++) {
        const campaign = await fundraiser.methods.campaigns(i).call()
        this.setState({
          campaigns: [...this.state.campaigns, campaign]
        })
      }

      console.log(this.state.campaigns,'this are campaigns running on the blockchain')
      this.setState({ loading: false })

    } else {
      window.alert('Marketplace contract not deployed to detected network.')
    }
    //to connect with the smart contract using abi and address
    
  }
  
  render() {
    return (
      <div>
        <Navbar account={this.state.account} balance = {this.state.balance}/>
        
        {this.state.loading
                ? <div id='loader' className='text-center'><p className='text-center'>loading...</p></div>
                : <Main
        campaigns = {this.state.campaigns}
        createCampaign = {this.createCampaign}
        Donate = {this.Donate}
        account={this.state.account}/>
      }
      </div>
    );
  }
}

export default App;
