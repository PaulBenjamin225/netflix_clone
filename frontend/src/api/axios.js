// frontend/src/api/axios.js
import axios from 'axios';

// On détermine l'URL du backend en fonction de l'environnement
const API_URL = process.env.NODE_ENV === 'production'
    ? 'https://netflix-clone-backend-kl8a.onrender.com/api' // L'URL de API sur Render
    : 'http://localhost:3000/api'; // L'URL locale

const instance = axios.create({
    baseURL: API_URL,
});

export default instance;