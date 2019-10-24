import React, { Component } from 'react';
import axios from 'axios';
import Pusher from 'pusher-js';

import './Today.css';

class Today extends Component {
  // Adds a class constructor that assigns the initial state values:
  constructor() {
    super();
    this.state = {
      btcprice: '',
      ltcprice: '',
      ethprice: ''
    };
  }
  componentDidMount() {
    setInterval(() => {
      axios
        .get(
          'https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,LTC&tsyms=USD&api_key=f0e5aed9f3cebd750f2fecb5149492f0a7810f1c60e18eff0dff3c0ee40f0c31'
        )
        .then(response => {
          this.sendPricePusher(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    }, 10000);
    // We bind to the 'prices' event and use the data in it (price information) to update the state values, thus, realtime changes
    this.prices.bind(
      'prices',
      price => {
        this.setState({ btcprice: price.prices.BTC.USD });
        this.setState({ ethprice: price.prices.ETH.USD });
        this.setState({ ltcprice: price.prices.LTC.USD });
      },
      this
    );
  }
  // This is called when an instance of a component is being created and inserted into the DOM.
  componentWillMount() {
    // establish a connection to Pusher
    this.pusher = new Pusher('7c82a895027713da7459', {
      cluster: 'eu',
      encrypted: true
    });
    // Subscribe to the 'coin-prices' channel
    this.prices = this.pusher.subscribe('coin-prices');
  }

  sendPricePusher(data) {
    axios
      .post('/prices/new', {
        prices: data
      })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  }

  // The render method contains the JSX code which will be compiled to HTML.
  render() {
    return (
      <div className='today--section container'>
        <h2>Current Price</h2>
        <div className='columns today--section__box'>
          <div className='column btc--section'>
            <h5>${this.state.btcprice}</h5>
            <p>1 BTC</p>
          </div>
          <div className='column eth--section'>
            <h5>${this.state.ethprice}</h5>
            <p>1 ETH</p>
          </div>
          <div className='column ltc--section'>
            <h5>${this.state.ltcprice}</h5>
            <p>1 LTC</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Today;
