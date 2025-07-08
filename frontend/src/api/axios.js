// frontend/src/api/axios.js
import axios from 'axios';

// L'URL de votre API DÉPLOYÉE
const API_URL = 'https://netflix-clone-backend-daej.onrender.com/api'; 

const instance = axios.create({
    baseURL: API_URL,
});

export default instance;