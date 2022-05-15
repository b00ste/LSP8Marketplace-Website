import React, { useState, useEffect } from 'react'
import './Components/CSS/App.css'
import Menu from './Components/Menu'
import Mint from './Components/Pages/Mint'
import Profile from './Components/Pages/Profile/Profile'
import Buy from './Components/Pages/Buy'
import Connect from './Components/Connect'

const App = () => {
  const [storage, setStorage] = useState({
    previousPage: undefined,
    page: window.location.pathname,
    pageTitle: undefined,
    pageDescription: undefined,
    account: "0x4125B8b4D61C8Bad6565035DDA827431077B2078",
    connected: false,
    universalReceiver: undefined,
    assets: [{ updated: false }],
    selectedAsset: undefined
  });

  useEffect(() => {
    if (window.location.pathname === storage.previousPage) {
      window.history.replaceState(
        storage.pageDescription,
        storage.pageTitle,
        storage.page
      );
    }

  }, [storage.pageDescription, storage.pageTitle, storage.page, storage.previousPage]);

  const handlePageChange = (pageDescription, pageTitle, page) => {
    setStorage({
      ...storage,
      previousPage: window.location.pathname,
      pageDescription,
      pageTitle,
      page
    })
  }

  return (
    <>
    {
      storage.connected
      ? 
        <div className='app'>
          <Menu handlePageChange={handlePageChange} storage={storage} setStorage={setStorage} />
          {
            storage.page === '/buy'
              ? <Buy storage={storage} setStorage={setStorage} />
              : storage.page === '/mint'
                ? <Mint storage={storage} setStorage={setStorage} />
                : storage.page === '/profile' || storage.page === '/'
                  ? <Profile storage={storage} setStorage={setStorage} />
                  : <h1>Something went wrong!<br />Please check that the URL is correct.</h1>
          }
        </div>
      : <Connect storage={storage} setStorage={setStorage} />
    }
    </>
  );
}

export default App;
