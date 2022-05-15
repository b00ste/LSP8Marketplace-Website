import React, { useState } from 'react';
import './CSS/Connect.css';

import Web3 from 'web3';
const web3 = new Web3(window.ethereum);

const Connect = ({ storage, setStorage }) => {

  const [account, setAccount] = useState('');
  const changeAccount = (newAccount) => {
    setAccount(newAccount);
  } 

  const connect = async () => {
    const accounts = await web3.eth.requestAccounts();
    console.log(accounts);
    setStorage({ ...storage, account: accounts[0] });
  }

  return (
      //<p className='btnText' onClick={connect}>connect</p>
      <div className='connect'>
        <div className='connect-form'>
          <input type='text' className='connect-input' placeholder='UP Address' onChange={event => changeAccount(event.target.value)} />
          <button className='connect-btn' onClick={() => setStorage({ ...storage, account, connected: true })}>connect</button>
        </div>
        <button className='skip-connect-btn' onClick={() => setStorage({ ...storage, connected: true })}>continue without connecting</button>
      </div>
  );
}

export default Connect;