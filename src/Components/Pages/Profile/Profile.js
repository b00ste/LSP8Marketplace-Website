import React, { useState, useEffect } from 'react';
import '../../CSS/Profile.css';
import ProfileAssets from './ProfileAssets';
import ProfileInfo from './ProfileInfo';
import SelectedAsset from './SelectedAsset';

const Profile = ({ storage, setStorage }) => {

  const [showAsset, setShowAsset] = useState(false);

  useEffect(() => {

    if (storage.selectedAsset === undefined) {
      setShowAsset(false);
    }
    else {
      setShowAsset(true);
    }

  }, [storage.selectedAsset]);

  return (
    <>
      <div className='profile'>
        <ProfileInfo storage={storage} setStorage={setStorage} />
      </div>
      <div className='assets' style={{width: window.innerWidth - 368}}>
        {
          showAsset
            ? <SelectedAsset storage={storage} setStorage={setStorage} />
            : <ProfileAssets storage={storage} setStorage={setStorage} />
        }
      </div>
    </>
  );
}

export default Profile;