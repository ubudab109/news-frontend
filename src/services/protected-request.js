import axios from "axios";
import { getStorage } from "utils/helper";

const http = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  headers: {
    'Authorization': `Bearer ${getStorage('token')}`,
  }
});

export default http;