import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../utils/Navbar05/Navbar05';

function Layout() {
  return (
    <>
    <Navbar />
    <Outlet />
    </>
  )
}

export default Layout