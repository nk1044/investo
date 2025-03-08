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
  try {
    const response = await axios.get(`${backendUrl}/strategy/performance`, {
      params: { instrument },
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: false,
    });
    console.log("data", response);
    return response?.data;
  } catch (error) {
    console.error("Error fetching stock performance:", error);
    throw error;
  }
}

export {
    getAllStocks,
    getStockdata,
    getStockPerformance
}