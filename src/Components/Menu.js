import React, { useState } from 'react'
import Connect from './Connect'
import './CSS/Menu.css'

const Menu = ({ handlePageChange, storage, setStorage }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className='menu' style={open ? { bottom: '.8rem' } : { bottom: '-2rem' }}>
      <div className='open-container'>
        <p className='btnText open' onClick={() => setOpen(!open)}>
          menu
        </p>
      </div>
      <p
        className='btnText'
        onClick={() => handlePageChange({ info: 'This is the Buy page' }, 'Buy', '/buy')}
      >
        buy
      </p>
      <p
        className='btnText'
        onClick={() => handlePageChange({ info: 'This is the Mint page' }, 'Mint', '/mint')}
      >
        mint
      </p>
      <p
        className='btnText'
        onClick={() => handlePageChange({ info: 'This is the Profile page' }, 'Profile', '/profile')}
      >
        profile
      </p>
      <Connect storage={storage} setStorage={setStorage} />
    </div>
  );
}

export default Menu;