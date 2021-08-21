import axios from 'axios';
import EnvConfig from './EnvConfig';

const API = axios.create({
    baseURL: EnvConfig.url
})

export default API;
