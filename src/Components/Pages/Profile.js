import React, { useState, useEffect } from 'react';
import '../CSS/Profile.css';
import { FaTwitter, FaDiscord, FaGithub } from 'react-icons/fa';

import Web3 from 'web3';
const web3 = new Web3('https://rpc.l14.lukso.network');

const { ERC725 } = require('@erc725/erc725.js');
require('isomorphic-fetch');
const erc725schema = require('./erc725schema.json');
const IPFS_GATEWAY = 'https://ipfs.lukso.network/ipfs/';
const provider = new Web3.providers.HttpProvider('https://rpc.l14.lukso.network');
const baseURL = 'https://ipfs.lukso.network/ipfs/';
const config = {
  ipfsGateway: IPFS_GATEWAY,
};

const Profile = ({ storage, setStorage }) => {

  const [profile, setProfile] = useState({
    updated: false,
    name: undefined,
    description: undefined,
    links: undefined,
    tags: undefined,
    picture: undefined,
    background: undefined,
    twitterLink: "https://twitter.com",
    discordLink: "https://discord.com",
    githubLink: "https://github.com"
  });

  const checkProfilePictureOrientation = () => {
    let img = new Image()
    img.src = profile.picture;
    if (img.height > img.width) {
      return <img className='profilePicture-portrait' src={profile.picture} alt="Profile"/>;
    }
    else {
      return <img className='profilePicture-landscape' src={profile.picture} alt="Profile"/>;
    }
  }

  useEffect(() => {

    function isValidAddress(address) {
      const formattedAddress = web3.utils.toChecksumAddress(address);
      return web3.utils.checkAddressChecksum(formattedAddress);
    }

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
        let backgroundImagesIPFS = data.LSP3Profile.LSP3Profile.backgroundImage;
        let profileImagesIPFS = data.LSP3Profile.LSP3Profile.profileImage;
        let backgroundImageLinks = [];
        let profileImageLinks = [];

        try {

          for (let i in backgroundImagesIPFS) {
            backgroundImageLinks.push([
              i,
              baseURL + backgroundImagesIPFS[i].url.substring(7),
            ]);
          }

          for (let i in profileImagesIPFS) {
            profileImageLinks.push([
              i,
              baseURL + profileImagesIPFS[i].url.substring(7),
            ]);
          }

        } catch (error) {
          return console.log('Could not fetch images');
        }
        
        setProfile({
          ...profile,
          updated: true,
          name: data.LSP3Profile.LSP3Profile.name,
          description: data.LSP3Profile.LSP3Profile.description.split('\n'),
          links: data.LSP3Profile.LSP3Profile.links,
          tags: data.LSP3Profile.LSP3Profile.tags,
          picture: profileImageLinks[0][1],
          background: backgroundImageLinks[0][1]
        });

        profile.links.forEach(element => {
          if (element.url.includes("twitter")) {
            setProfile({ ...profile, twitterLink: element.url });
          }
          else if (element.url.includes("discord")) {
            setProfile({ ...profile, discordLink: element.url });
          }
          else if (element.url.includes("github")) {
            setProfile({ ...profile, githubLink: element.url });
          }
        });
        
      });
      
    }

    fetchProfileData();

  }, [storage.account, profile])
  

  return (
    <div className='profile'>
      <div className='header'>
        {
          profile.updated
            ?
            <>
              <img className='profileBackground' src={profile.background} alt="Background"/>
              <div className='profilePicture-container' onClick={() => window.open(("https://blockscout.com/lukso/l14/address/" + storage.account), "_blank")}>
                {checkProfilePictureOrientation()}
              </div>
            </>
            :<p>Loading...</p>
        }
      </div>
      <div className='body' style={{maxHeight: window.innerHeight * 0.9 - 192}} >
        {
          profile.updated
          ? <>
              <p className='profileName'>{profile.name}</p>
              <p className='profileDescription'>
                {
                  profile.description.map(element => <>{element}<br/></>)
                }
              </p>
              {
                profile.tags.map( ( element, i ) => <p>{element}</p> )
              }
            </>
          : <p>Loading...</p>
        }
        <div className='social-links'>
          <FaTwitter size='2em' className='link twitter' onClick={() => window.open(profile.twitterLink, "_blank")} />
          <FaDiscord size='2em' className='link discord' onClick={() => window.open(profile.discordLink, "_blank")} />
          <FaGithub size='2em' className='link github' onClick={() => window.open(profile.githubLink, "_blank")} />
        </div>
      </div>
    </div>
  );
}

export default Profile;