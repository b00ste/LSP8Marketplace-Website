import React from 'react';
import '../../CSS/Profile.css';
import ProfileAssets from './ProfileAssets';
import ProfileInfo from './ProfileInfo';

const Profile = ({ storage, setStorage }) => {
  

  return (
    <>
      <div className='profile'>
        <ProfileInfo storage={storage} setStorage={setStorage} />
      </div>
      <div className='assets' style={{width: window.innerWidth - 368}}>
        <ProfileAssets storage={storage} setStorage={setStorage} />
      </div>
    </>
  );
}

export default Profile;