import axios from "axios";

export const api = axios.create({
    baseURL: 'http://172.17.5.22:3333'
})