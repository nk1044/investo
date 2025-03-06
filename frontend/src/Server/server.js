import axios from 'axios';


const backendUrl = import.meta.env.VITE_BACKEND_URL;

const getAllStocks = async () => {
  console.log(backendUrl);
  const response = await axios.get(`${backendUrl}/get-all-stocks`);
  // console.log(response);
  return response?.data;
}

export {
    getAllStocks,
}