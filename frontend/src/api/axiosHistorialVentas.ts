import axios from "axios";

const apiVentas = axios.create({
  baseURL: "http://38.250.161.15:3000",
});

export default apiVentas;