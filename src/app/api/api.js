import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
  timeout: 30000
})

api.interceptors.request.use(
  (config) => {
      //Get Tokens
      const token = localStorage.getItem('token');
      //If there is a token ?
      if(token){
          //Request headers
          config.headers["Authorization"] = `Bearer ${token}`
      }
      return config;
  },
  (error) => Promise.reject(error),
);

//Response interceptors
api.interceptors.response.use(
  (response) => {
      return response?.data;
  },
  (error) => {
      console.log(error)
      return Promise.resolve(error?.response?.data);
  }
);


export default api;