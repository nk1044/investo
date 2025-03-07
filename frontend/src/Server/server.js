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

const getStockPerformance = async (instrument) => {
  const response = await axios.get(`${backendUrl}/strategy/performance?instrument=${instrument}`);
  console.log(response?.data);
  return response?.data;
}

export {
    getAllStocks,
    getStockdata,
    getStockPerformance
}