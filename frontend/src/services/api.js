import axios from "axios";


export const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

const instance = axios.create({
    baseURL: `http://localhost:4000/api`
})

export default instance

