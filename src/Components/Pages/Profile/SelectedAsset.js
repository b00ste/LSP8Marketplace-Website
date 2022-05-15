import React, { useState } from 'react';
import { MdExitToApp, MdSell } from 'react-icons/md';
import { GrLinkNext, GrLinkPrevious } from 'react-icons/gr';
import '../../CSS/SelectedAsset.css';
import SelectedAssetImages from './SelectedAssetImages'; 

const SelectedAsset = ({ storage, setStorage }) => {

  const [page, setPage] = useState(0);

  return (
    <div className='selected-asset'>
      <MdExitToApp
        size='2em'
        className='exit-btn btn'
        onClick={() => setStorage({ ...storage, selectedAsset: undefined })}
      />
      {
        page === 1
        ? <>
            <p>This is the sale page.</p>
            <GrLinkNext size='2em' className='next-btn btn' onClick={() => setPage(0)} />
            <GrLinkPrevious size='2em' className='previous-btn btn' onClick={() => setPage(0)} />
          </>
        : <>
            { storage.selectedAsset !== undefined ? <SelectedAssetImages storage={storage} /> : <></> }
            <p className='description'>
              {
                storage.selectedAsset !== undefined
                  ? storage.assets[storage.selectedAsset].data.LSP4Metadata.description
                  : ""
              }
            </p>
            <MdSell
              size='2em'
              className='sell-btn btn'
              onClick={() => setPage(1)}
            />
          </>
      }
    </div>
  );
}

export default SelectedAsset;