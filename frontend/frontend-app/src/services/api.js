 import axios from "axios";

const API = "http://localhost:3000";

export const getHealth = () => axios.get(`${API}/health`);
