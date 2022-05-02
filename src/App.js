import React, { useState, useEffect } from 'react'
import './Components/CSS/App.css'
import Menu from './Components/Menu'
import Mint from './Components/Pages/Mint'
import Sell from './Components/Pages/Sell'
import Buy from './Components/Pages/Buy'

const App = () => {
  const [storage, setStorage] = useState({
    previousPage: undefined,
    page: window.location.pathname,
    pageTitle: undefined,
    pageDescription: undefined,
    accounts: undefined
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
    <div className='app'>
      <Menu handlePageChange={handlePageChange} storage={storage} setStorage={setStorage} />
      {
        storage.page === '/buy' || storage.page === '/'
          ? <Buy storage={storage} setStorage={setStorage} />
          : storage.page === '/mint'
            ? <Mint storage={storage} setStorage={setStorage} />
            : storage.page === '/sell'
              ? <Sell storage={storage} setStorage={setStorage} />
              : <h1>Something went wrong!<br />Please check that the URL is correct.</h1>
      }
    </div>
  );
}

export default App;
