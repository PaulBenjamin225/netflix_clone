// Fichier complet et corrigé : src/pages/Login.jsx

import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';

// --- STYLED COMPONENTS ---

const LoginPageContainer = styled.div`
  height: 100vh;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  color: white;

  /* On s'assure que le fond est bien défini */
  background-color: #000; /* Un fallback noir si l'image ne charge pas */
  background-image: 
    linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url('/login-bg.jpg');
  background-size: cover;
  background-position: center;
`;

const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1; /* Très important pour la mise en page */
  padding: 20px;
  z-index: 5; /* S'assure que le contenu est devant le fond */
`;

const LoginFormWrapper = styled.div`
  width: 100%;
  max-width: 450px;
  background: rgba(0, 0, 0, 0.75);
  border-radius: 4px;
  padding: 60px;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 28px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  background: #333;
  border: none;
  border-radius: 4px;
  padding: 16px;
  color: white;
  font-size: 1rem;
  margin-bottom: 20px;
`;

const SubmitButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 4px;
  padding: 16px;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 24px;
  
  &:hover {
    background: #f40612;
  }
`;

const SignupPrompt = styled.p`
  color: #b3b3b3;
  margin-top: 40px;

  a {
    color: white;
    font-weight: 500;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.p`
  color: #e87c03;
  background-color: #333;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
`;


// --- REACT COMPONENT ---

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Veuillez entrer votre e-mail et votre mot de passe.');
      return;
    }

    try {
      await login(email, password); 
    } catch (err) {
      // Notre contexte ne propage pas l'erreur, il la gère. On met un message générique.
      setError("L'adresse e-mail ou le mot de passe est incorrect.");
    }
  };

  return (
    <LoginPageContainer>
      <Header />
      <Content>
        <LoginFormWrapper>
          <Title>S'identifier</Title>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Form onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="E-mail ou numéro de téléphone"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <SubmitButton type="submit">S'identifier</SubmitButton>
          </Form>

          <SignupPrompt>
            Première visite sur Netflix ? <Link to="/signup">Inscrivez-vous</Link>.
          </SignupPrompt>

        </LoginFormWrapper>
      </Content>
    </LoginPageContainer>
  );
};

export default Login;