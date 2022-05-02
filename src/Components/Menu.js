import React, { useState } from 'react'
import Connect from './Connect'
import './CSS/Menu.css'

const Menu = ({ handlePageChange, storage, setStorage }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className='menu' style={open ? { 'width': '20rem' } : { 'width': '3rem' }}>
      {
        open
          ? <>
            <p
              className='btnText'
              onClick={() => setOpen(false)}
            >
              close
            </p>
            <p
              className='btnText'
              onClick={() => handlePageChange({ info: 'This is the Buy page' }, 'Buy', '/buy')}
            >
              Buy
            </p>
            <p
              className='btnText'
              onClick={() => handlePageChange({ info: 'This is the Sell page' }, 'Sell', '/sell')}
            >
              Sell
            </p>
            <p
              className='btnText'
              onClick={() => handlePageChange({ info: 'This is the Mint page' }, 'Mint', '/mint')}
            >
              Mint
            </p>
            <Connect storage={storage} setStorage={setStorage} />
          </>
          : <p className='btnText' onClick={() => setOpen(true)}>open</p>
      }
    </div>
  );
}

export default Menu;