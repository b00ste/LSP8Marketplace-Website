import React from 'react'

import Web3 from 'web3';
const web3 = new Web3(window.ethereum);

const Connect = ({ storage, setStorage }) => {

  const connect = async () => {
    const accountsRequest = await web3.eth.requestAccounts();
    const accounts = await web3.eth.getAccounts(); //should also yield the same address
    console.log(accounts);
    setStorage({ ...storage, accounts });
  }

  return (
      <p className='btnText' onClick={connect}>connect</p>
  );
}

export default Connect;