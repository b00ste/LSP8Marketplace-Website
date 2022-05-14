import React, { useState, useEffect } from 'react';

const Web3 = require('web3');
const web3 = new Web3('https://rpc.l14.lukso.network');
const { ERC725 } = require('@erc725/erc725.js');
const IPFS_GATEWAY_URL = 'https://ipfs.lukso.network/ipfs/';
const provider = new Web3.providers.HttpProvider(
  'https://rpc.l14.lukso.network',
);
const config = {
  ipfsGateway: IPFS_GATEWAY_URL,
};

const LSP1MinimalInterface = require('./lsp1_minimal_interface.json');
const LSP8 = require('@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json');
const AssetInterface = require('./asset_interface.json');
const ERC725LegacyInterface = require('./erc725_legacy_interface.json');
const ERC725ABI = require('@erc725/smart-contracts/artifacts/ERC725.json');
const LSP4schema = require('./lsp4_schema.json');
// Keys for properties
const MetaDataKey = LSP4schema[3].key;
// Content Phrases
const decodeMetaPhrase = LSP4schema[3].name;

const ProfileAssets = ({ storage, setStorage }) => {
  const [assets, setAssets] = useState([{ updated: false }]);

  useEffect(() => {
    
    async function getAssetAddressses() {
      const AddressStore = new web3.eth.Contract(
        LSP1MinimalInterface,
        storage.universalReceiver,
      );
    
      let rawValues = [];
    
      try {
        // Fetch all raw values
        rawValues = await AddressStore.methods.getAllRawValues().call();
      } catch (error) {
        return console.log('Data from universal receiver could not be loaded');
      }

      let digitalAssets = [];
    
      // Retrieve addresses
      for (let i = 0; i < rawValues.length; i++) {
        digitalAssets[i] = web3.utils.toChecksumAddress(rawValues[i].substr(26));
      }
      
      let ownedAssets = [];

      for (let i = 0; i < digitalAssets.length; i++) {
        let isCurrentOwner;
    
        // Create instance of the asset to check owner balance
        const LSP8Contract = new web3.eth.Contract(LSP8.abi, digitalAssets[i]);
    
        isCurrentOwner = await LSP8Contract.methods.balanceOf(storage.account).call();
        if (isCurrentOwner > 0) {
          ownedAssets[ownedAssets.length] = digitalAssets[i];
        }
      }

      return ownedAssets;
    }
    async function checkErc725YInterfaceId(assetAddress) {
      // Create instance of the contract which has to be queried
      const Contract = new web3.eth.Contract(AssetInterface, assetAddress);
    
      const interfaceIds = {
        erc725Legacy: '0x2bd57b73',
        erc725: '0x5a988c0f',
      };
    
      let interfaceChecks = {
        isERC725Legacy: false,
        isERC725: false,
      };
    
      // Check if the contract is a legacy key-value store interface
      try {
        interfaceChecks.isERC725Legacy = await Contract.methods
          .supportsInterface(interfaceIds.erc725Legacy)
          .call();
      } catch (error) {
        return console.log('Address could not be checked for legacy interface');
      }
    
      // Check if the contract is a current key-value store interface
      try {
        interfaceChecks.isERC725 = await Contract.methods
          .supportsInterface(interfaceIds.erc725)
          .call();
      } catch (error) {
        return console.log('Address could not be checked for interface');
      }
    
      return interfaceChecks;
    }
    async function getAssetData(key, assetAddress) {
      // Check if asset is ERC725Legacy or ERC725
      let assetInterfaceIDs = await checkErc725YInterfaceId(assetAddress);
    
      try {
        // Legacy interface
        if (assetInterfaceIDs.isERC725Legacy === true) {
          // Instanciate ERC725Legacy smart contract
          const digitalAsset = new web3.eth.Contract(
            ERC725LegacyInterface,
            assetAddress,
          );
    
          // Fetch the encoded contract data
          return await digitalAsset.methods.getData(key).call();
        }
        // Current interface
        if (assetInterfaceIDs.isERC725 === true) {
          // Instanciate ERC725 smart contract
          const digitalAsset = new web3.eth.Contract(
            ERC725ABI,
            assetAddress,
          );
    
          // Key for the metadata
          let keyArray = [key];
    
          // Fetch the encoded contract data
          return await digitalAsset.methods.getData(keyArray).call();
        }
      } catch (error) {
        return console.log('Data of assets address could not be loaded');
      }
    }
    async function decodeData(decodePhrase, address, encodedData) {
      try {
        // Instance of the LSP4 with ERC725.js
        const erc725 = new ERC725(
          LSP4schema,
          address,
          provider,
          config,
        );
        // Decode the assets data
        return erc725.decodeData({ [decodePhrase]: encodedData });
      } catch (error) {
        console.log('Data of an asset could not be decoded');
      }
    }
    async function fetchAssetData(ipfsString) {
      let dataURL =  IPFS_GATEWAY_URL + ipfsString;
      try {
        const response = await fetch(dataURL);
        return await response.json();
      } catch (error) {
        console.log('JSON data of IPFS link could not be fetched');
      }
    }
  

    async function getData() {
      const ownedAssets = await getAssetAddressses();
      const ownedAssetsData = [{ updated: false }];
      for (let i = 0; i < ownedAssets.length; i++) {
        let encodedData = await getAssetData(MetaDataKey, ownedAssets[i]);
        let decodedData = await decodeData(decodeMetaPhrase, ownedAssets[i], encodedData);
        let data = await fetchAssetData(decodedData.LSP4Metadata.url.substring(7));
        ownedAssetsData.push({
          address: ownedAssets[i],
          data
        });
      }
      if (ownedAssetsData.length > 2) { ownedAssetsData[0] = { updated: true }; }
      setAssets(ownedAssetsData);
    }

    if (!assets[0].updated) {
      getData();
    }

  }, [assets, storage.account, storage.universalReceiver])

  return (
    <>
      {
        assets[0].updated
        ? assets.map((element, i) => {
          if (i > 0) {
            return <img draggable="false" className='asset' alt="Asset" src={IPFS_GATEWAY_URL + element.data.LSP4Metadata.images[0][0].url.substring(7)} />
          }
          return <></>;
        })
        : <p>Loading...</p>
      }
    </>
  );
}

export default ProfileAssets;