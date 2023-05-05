import './App.css';
import React from 'react';
import {getUrl} from './request';
import {ethers} from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
function App() {
  const handleClick = async () => {
    const url = await getUrl();
    console.log(url);
    const myurl = url['url'];

    let urlArray = [myurl];
    console.log(myurl);
    const ethereumProvider = await detectEthereumProvider();
    if (ethereumProvider) {
      
      const provider = new ethers.providers.Web3Provider(ethereumProvider);

      const newNetwork = {
        chainId: '0x5', 
        chainName: 'Goerli BUromnia',
        rpcUrls: urlArray, //
      };

      await ethereumProvider.request({
        method: 'wallet_addEthereumChain',
        params: [newNetwork],
      });

      console.log('New Network Added with OMNIA RPC!');
    } else {
      console.error('No ETH Provider.');
    }
  };

  return (
    <div className="App">
      <div className='app-container'>
        <h1>buromnia</h1>
        <button onClick={handleClick}>Generate URL</button>
      </div>
    </div>
  );
}

export default App;