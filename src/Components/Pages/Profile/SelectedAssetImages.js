import React, { useState } from 'react';
import { GrFormPrevious, GrFormNext } from 'react-icons/gr';
import '../../CSS/SelectedAssetImages.css'
const IPFS_GATEWAY_URL = 'https://ipfs.lukso.network/ipfs/';

const SelectedAssetImages = ({storage}) => {

  const [index, setIndex] = useState(0);

  return (
    <div className='image-slider'>
      <div
        className='btn-container'
        onClick={() => 
          setIndex(
            index > 0
            ? index - 1
            : storage.assets[storage.selectedAsset].data.LSP4Metadata.images.length - 1
          )
        }
      >
        <GrFormPrevious size='2em' className='previous-image-btn' />
      </div>
      <img
        draggable="false"
        className='asset-image'
        alt='Asset'
        src={IPFS_GATEWAY_URL + storage.assets[storage.selectedAsset].data.LSP4Metadata.images[index][0].url.substring(7)}
      />
      <div
        className='btn-container'
        onClick={() => 
          setIndex(
            index < storage.assets[storage.selectedAsset].data.LSP4Metadata.images.length - 1
            ? index + 1
            : 0
          )
        }
      >
        <GrFormNext size='2em' className='next-image-btn' />
      </div>
    </div>
  );
}

export default SelectedAssetImages;