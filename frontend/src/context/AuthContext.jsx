import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios'; // Notre instance d'axios

// 1. Créer le contexte
const AuthContext = createContext(null);

// 2. Créer le fournisseur (Provider)
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Pour savoir si on vérifie encore le token
    const navigate = useNavigate();

    // Au chargement de l'app, vérifier si un token est dans le localStorage
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Ici, on pourrait ajouter une logique pour vérifier la validité du token
            // en appelant une route /me sur le backend. Pour l'instant, on fait confiance.
            const userData = JSON.parse(localStorage.getItem('user'));
            setUser(userData);
            // Important: Mettre le token dans les en-têtes axios pour les futures requêtes
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setLoading(false);
    }, []);

    // Fonction de connexion
    const login = async (email, password) => {
        try {
            const response = await apiClient.post('/auth/login', { email, password });
            
            // Stocker le token et les infos utilisateur
            const { token, user: userData } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            
            // Mettre à jour l'état et les en-têtes axios
            setUser(userData);
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Rediriger vers la page de sélection des profils (ou /browse pour l'instant)
            navigate('/browse');

        } catch (error) {
            console.error('Erreur de connexion:', error.response?.data?.message || error.message);
            // On pourrait stocker l'erreur dans un état pour l'afficher à l'utilisateur
            alert(error.response?.data?.message || "Une erreur est survenue.");
        }
    };

    // Fonction de déconnexion
    const logout = () => {
        // Nettoyer le state et le localStorage
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete apiClient.defaults.headers.common['Authorization'];
        navigate('/login');
    };

    // Les valeurs que le contexte va fournir
    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user, // Un booléen pratique pour savoir si on est connecté
    };
    
    // On ne rend les enfants que lorsque le chargement initial est terminé
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// 3. Créer un hook personnalisé pour utiliser facilement le contexte
export const useAuth = () => {
    return useContext(AuthContext);
};