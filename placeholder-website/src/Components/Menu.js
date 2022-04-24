import React, { useState } from 'react'
import Connect from './Connect'
import { StyledMenu } from './Styled'

const Menu = ({ storage, setStorage }) => {
  const [open, setOpen] = useState(false);

  return (
    <StyledMenu style={open ? { 'width': '20rem' } : { 'width': '3rem' }}>
      {
        open
        ? <>
        <p className='btnText' onClick={() => setOpen(false)}>close</p>
        <p className='btnText' onClick={() => setStorage({ ...storage, page: 'buy' })}>Buy</p>
        <p className='btnText' onClick={() => setStorage({ ...storage, page: 'sell' })}>Sell</p>
        <p className='btnText' onClick={() => setStorage({ ...storage, page: 'mint' })}>Mint</p>
        <Connect storage={storage} setStorage={setStorage} />
        </>
        : <p className='btnText' onClick={() => setOpen(true)}>open</p>
      }
    </StyledMenu>
  );
}

export default Menu;