// src/pages/Signup.jsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import Header from '../components/Header'; // <-- On importe le Header

const SignupPageContainer = styled.div`
  background-color: white;
  min-height: 100vh;
  color: #333;
  display: flex;
  flex-direction: column;
`;

const FormWrapper = styled.div`
  width: 100%;
  max-width: 440px;
  margin: 40px auto; // Ajoute de l'espace au-dessus et en dessous
  padding: 0 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
    margin: 15px 0;
    font-size: 1.1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 16px;
  border: 1px solid #8c8c8c;
  border-radius: 2px;
  font-size: 1rem;
`;

const SubmitButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 4px;
  padding: 16px;
  color: ${({ theme }) => theme.colors.white};
  font-size: 1.5rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 20px;
  
  &:hover {
    background: #f40612;
  }
`;

const ErrorMessage = styled.p`
    color: #b92d2b;
    margin-top: 10px;
`;

const Footer = styled.footer`
  background-color: #f3f3f3;
  border-top: 1px solid #e6e6e6;
  padding: 30px 0;
  margin-top: auto; // Pousse le footer en bas
`;


const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailFromHome = params.get('email');
    if (emailFromHome) {
      setEmail(emailFromHome);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
        setError('Veuillez remplir tous les champs.');
        return;
    }

    try {
      await apiClient.post('/auth/register', { email, password });
      alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      navigate('/login');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Une erreur est survenue lors de l\'inscription.';
      setError(errorMessage);
    }
  };

  return (
    <SignupPageContainer>
        {/* On ajoute le Header avec un fond blanc et le lien "Connexion" */}
        <Header solid={true} showLoginLink={true} />

        <FormWrapper>
            {/* On supprime la ligne "ÉTAPE 1 SUR 3" */}
            <Title>Créez un mot de passe pour commencer votre abonnement.</Title>
            <Subtitle>Plus que quelques étapes et c'est terminé !<br/>Nous aussi, on déteste la paperasse.</Subtitle>
            <Form onSubmit={handleSubmit}>
              <Input
                type="email"
                placeholder="Adresse e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Ajoutez un mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <ErrorMessage>{error}</ErrorMessage>}
              <SubmitButton type="submit">Suivant</SubmitButton>
            </Form>
        </FormWrapper>
        
        <Footer />
    </SignupPageContainer>
  );
};

export default Signup;