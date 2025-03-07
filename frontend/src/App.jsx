import { useState } from 'react'
import Home from './Pages/Home'
import Stocks from './Pages/Stocks';
import Stockdata from './Pages/Stockdata';
import Layout from './Components/Layout'
import {createBrowserRouter, RouterProvider} from 'react-router-dom';

const router = createBrowserRouter([
  {path: '/', element: <Layout />, children: [
    {path: '', element: <Home />},
    {path: 'stocks', element: <Stocks />},
    {path: 'stocks-data/:instrument', element: <Stockdata />}
  ]}
]);

function App() {

  return <RouterProvider router={router}/>
}

export default App
