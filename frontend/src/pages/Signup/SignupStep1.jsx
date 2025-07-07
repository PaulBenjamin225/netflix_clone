// Fichier complet : src/pages/Signup/SignupStep1.jsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../../api/axios';

// --- STYLED COMPONENTS ---

const FormContainer = styled.div`
  width: 100%;
  max-width: 440px;
  margin: 40px auto;
  padding: 0 20px;
`;

const StepIndicator = styled.p`
  font-size: 0.8125rem; /* 13px */
  line-height: 1.2;
`;

const Title = styled.h1`
  font-size: 2rem; /* 32px */
  font-weight: 700;
  margin: 0.5rem 0;
`;

const Subtitle = styled.p`
  font-size: 1.125rem; /* 18px */
  line-height: 1.5;
  margin-top: 0.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 1.5rem;
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const InputLabel = styled.label`
  position: absolute;
  top: 50%;
  left: 16px;
  transform: translateY(-50%);
  color: #8c8c8c;
  font-size: 1rem;
  transition: all 0.1s ease-in-out;
  pointer-events: none;
`;

const Input = styled.input`
  width: 100%;
  padding: 24px 16px 8px 16px;
  border: 1px solid #8c8c8c;
  border-radius: 4px;
  font-size: 1rem;

  &:focus + ${InputLabel},
  &:not(:placeholder-shown) + ${InputLabel} {
    top: 10px;
    font-size: 0.75rem;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
`;

const Checkbox = styled.input`
  margin-right: 10px;
  width: 18px;
  height: 18px;
`;

const SubmitButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 4px;
  padding: 16px;
  color: ${({ theme }) => theme.colors.white};
  font-size: 1.5rem; /* 24px */
  font-weight: 500;
  cursor: pointer;
  margin-top: 1.5rem;
  
  &:hover {
    background: #f40612;
  }
`;

const ErrorMessage = styled.p`
  color: #b92d2b;
  margin-top: 0.5rem;
`;

// --- REACT COMPONENT ---

const SignupStep1 = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isEmailFromHome, setIsEmailFromHome] = useState(false); // État pour gérer la lecture seule

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailFromHome = params.get('email');
    if (emailFromHome) {
      setEmail(emailFromHome);
      setIsEmailFromHome(true); // L'email vient de la page d'accueil, on le verrouille
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
      const loginRes = await apiClient.post('/auth/login', { email, password });
      
      localStorage.setItem('token', loginRes.data.token);
      localStorage.setItem('user', JSON.stringify(loginRes.data.user));
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${loginRes.data.token}`;
      
      navigate('/signup/planform');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Une erreur est survenue.';
      setError(errorMessage);
    }
  };

  return (
    <FormContainer>
      <StepIndicator>ÉTAPE <strong>1</strong> SUR <strong>3</strong></StepIndicator>
      <Title>Créez un mot de passe pour commencer votre adhésion</Title>
      <Subtitle>
        Plus que quelques étapes et le tour est joué !<br/>
        Nous détestons aussi la paperasse.
      </Subtitle>

      <Form onSubmit={handleSubmit}>
        <InputWrapper>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // On permet la modification
            readOnly={isEmailFromHome} // On la bloque conditionnellement
            placeholder=" "
          />
          <InputLabel htmlFor="email">Messagerie électronique</InputLabel>
        </InputWrapper>
        
        <InputWrapper>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder=" "
          />
          <InputLabel htmlFor="password">Ajouter un mot de passe</InputLabel>
        </InputWrapper>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <CheckboxContainer>
          <Checkbox type="checkbox" id="offers" />
          <label htmlFor="offers">S'il vous plaît ne m'envoyez pas d'offres spéciales Netflix par e-mail.</label>
        </CheckboxContainer>

        <SubmitButton type="submit">Prochain</SubmitButton>
      </Form>
    </FormContainer>
  );
};

export default SignupStep1;