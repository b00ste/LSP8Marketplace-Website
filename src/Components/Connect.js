import React from 'react';

import Web3 from 'web3';
const web3 = new Web3(window.ethereum);

const Connect = ({ storage, setStorage }) => {

  const connect = async () => {
    const accounts = await web3.eth.requestAccounts();
    console.log(accounts);
    setStorage({ ...storage, account: accounts[0] });
  }

  return (
      <p className='btnText' onClick={connect}>connect</p>
  );
}

export default Connect;