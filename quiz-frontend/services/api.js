import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api' // ou outra porta se seu backend estiver em outra
});

export default api;
