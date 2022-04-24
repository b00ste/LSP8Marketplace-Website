import React, { useState } from 'react'
import { StyledBody } from './Components/Styled'
import Menu from './Components/Menu'
import Mint from './Components/Pages/Mint'
import Sell from './Components/Pages/Sell'
import Buy from './Components/Pages/Buy'
import LSP7Mintable from '@lukso/lsp-smart-contracts/artifacts/LSP7Mintable.json';

const App = () => {
  const [storage, setStorage] = useState({ page: 'buy' });

  return (
    <StyledBody>
      <Menu storage={storage} setStorage={setStorage} />
      {
        storage.page == 'buy'
          ? <Buy storage={storage} setStorage={setStorage} />
            : storage.page === 'mint'
              ? <Mint storage={storage} setStorage={setStorage} />
              : storage.page === 'sell'
                ? <Sell storage={storage} setStorage={setStorage} />
                  : <h1>Something went wrong!<br />Please refresh the page.</h1>
      }
    </StyledBody>
  );
}

export default App;
