import axios from 'axios';


const backendUrl = import.meta.env.VITE_BACKEND_URL;

const getAllStocks = async () => {
  console.log(backendUrl);
  const response = await axios.get(`${backendUrl}/get-all-stocks`);
  // console.log(response);
  return response?.data;
}

const getStockdata = async (instrument) => {
  const response = await axios.get(`${backendUrl}/get-stock-data?instrument=${instrument}`);
  return response?.data?.data;
}

export {
    getAllStocks,
    getStockdata
}