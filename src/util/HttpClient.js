import axios from 'axios';

export const httpClient = axios.create({
  baseURL: 'http://10.0.2.2:8080',
});
