import React, { useState, useEffect } from 'react';

const Web3 = require('web3');
const web3 = new Web3('https://rpc.l14.lukso.network');

const LSP1MinimalInterface = require('./lsp1_minimal_interface.json');
const LSP8 = require('@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json');
const AssetInterface = require('./asset_interface.json');
const ERC725ABI = require('@erc725/smart-contracts/artifacts/ERC725.json');
const LSP4schema = require('./lsp4_schema.json');

// Keys for properties
const TokenNameKey = LSP4schema[1].key;
const TokenSymbolKey = LSP4schema[2].key;
const MetaDataKey = LSP4schema[3].key;
const CreatorsKey = LSP4schema[4].key;

const ProfileAssets = ({ storage, setStorage }) => {
  const [assets, setAssets] = useState({
    updated: false
  });

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
    
      console.log(assetAddress);
      console.log(interfaceChecks);
      return interfaceChecks;
    }
    async function getAssetData(key, assetAddress) {
      // Check if asset is ERC725Legacy or ERC725
      let assetInterfaceID = await checkErc725YInterfaceId(assetAddress);
    
      try {
        if (assetInterfaceID === true) {
          // Instanciate ERC725 smart contract
          const digitalAsset = new web3.eth.Contract(
            ERC725ABI,
            assetAddress,
          );
    
          // Key for the metadata
          let keyArray = [key];
    
          // Fetch the encoded contract data
          return await digitalAsset.methods["getData(bytes32[])"](keyArray).call();
        }
      } catch (error) {
        return console.log('Data of assets address could not be loaded');
      }
    }

    async function getData() {
      const ownedAssets = await getAssetAddressses();
      console.log(ownedAssets);
      for (let i = 0; i < ownedAssets.length; i++) {
        getAssetData(MetaDataKey, ownedAssets[i])
        .then(res => console.log(res));
      }
    }

    // Debug
    if (!assets.updated) {
      //getAssetAddressses().then((digitalAssets) => console.log(digitalAssets));
      getData();
    }

  }, [assets, storage.account, storage.universalReceiver])

  return (
    <></>
  );
}

export default ProfileAssets;