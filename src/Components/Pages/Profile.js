import React, { useState, useEffect } from 'react'

import Web3 from 'web3';
const web3 = new Web3('https://rpc.l14.lukso.network');

const { ERC725 } = require('@erc725/erc725.js');
require('isomorphic-fetch');
const erc725schema = require('./erc725schema.json');
const IPFS_GATEWAY = 'https://ipfs.lukso.network/ipfs/';
const provider = new Web3.providers.HttpProvider('https://rpc.l14.lukso.network');
const config = {
  ipfsGateway: IPFS_GATEWAY,
};

const Profile = ({ storage, setStorage }) => {

  const [profile, setProfile] = useState({
    name: undefined,
    description: undefined,
    links: undefined,
    tags: undefined,
  })

  function isValidAddress(address) {
    const formattedAddress = web3.utils.toChecksumAddress(address);
    return web3.utils.checkAddressChecksum(formattedAddress);
  }

  useEffect(() => {

    async function getProfile(address) {
      if (isValidAddress(address)) {
        try {
          const erc725 = new ERC725(erc725schema, address, provider, config);
          return await erc725.fetchData();
        } catch (error) {
          return console.log('This is not an ERC725 Contract');
        }
      } else {
        return console.log('This is not an blockchain address');
      }
    }
    
    async function fetchProfileData() {
      getProfile(storage.account)
      .then( data => {
        
        setProfile({
          name: data.LSP3Profile.LSP3Profile.name,
          description: data.LSP3Profile.LSP3Profile.description,
          links: data.LSP3Profile.LSP3Profile.links,
          tags: data.LSP3Profile.LSP3Profile.tags,
        });

      });
      
    }

    fetchProfileData();

  }, [storage.account])
  

  return (
    <div className='profile'>
      <p>{storage.account}</p>
      {
        profile.name !== undefined
        ? <>
            <p>{profile.name}</p>
            <p>{profile.description}</p>
            <p>{profile.links[0].title}</p>
            <p>{profile.links[0].url}</p>
            <p>{profile.links[1].title}</p>
            <p>{profile.links[1].url}</p>
          </>
        : <></>
      }
      <button onClick={() => console.log(profile)}>check address</button>
    </div>
  );
}

export default Profile;