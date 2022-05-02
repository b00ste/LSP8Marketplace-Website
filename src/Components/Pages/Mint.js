import React, { useState } from 'react'
import LSP7Mintable from '@lukso/lsp-smart-contracts/artifacts/LSP7Mintable.json'
import Web3 from 'web3';
const web3 = new Web3(window.ethereum);

const Mint = ({ storage, setStorage }) => {
  const [token, setToken] = useState({
    name: undefined,
    symbol: undefined,
    owner: storage.accounts,
    isNFT: undefined
  });

  const deployToken = async () => {

    if(!token.name) {
      alert('Please set a token name.')
      return 0;
    }
    else if(!token.symbol) {
      alert('Please set a token symbol.')
      return 0;
    }
    else if(!token.isNFT) {
      alert('Please select if you want a Fungible Token or an NFT.')
      return 0;
    }
    else if(!token.owner) {
      alert('Please connect to the website.')
      return 0;
    }

    const tokenParams = [
      token.name,
      token.symbol,
      token.owner,
      token.isNFT
    ];
    const myToken = new web3.eth.Contract(LSP7Mintable.abi, {
      gas: 5_000_000,
      gasPrice: '1000000000',
    });
    await myToken
      .deploy({ data: LSP7Mintable.bytecode, arguments: tokenParams })
      .send({
        from: storage.accounts,
      })
      .then(res => console.log(res));
  }

  return (
    <div className='mint'>
      <p>Mint page</p>
      <input type='text' placeholder='Token Name' onChange={(e) => setToken({ ...token, name: e.target.value })} />
      <input type='text' placeholder='Token Symbol' onChange={(e) => setToken({ ...token, symbol: e.target.value })} />
      <div onChange={(e) => setToken({ ...token, isNFT: e.target.value === 'non-fungible' ? true : false })}>
        <p>NFT <input type='radio' value='non-fungible' name='type' /></p>
        <p>Fungible Token <input type='radio' value='fungible' name='type' /></p>
      </div>
      <button onClick={() => deployToken()}>Mint</button>
    </div>
  );
}

export default Mint;