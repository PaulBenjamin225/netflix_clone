import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header'; // On importe notre nouveau Header
import { IoChevronForward } from 'react-icons/io5'; // Une icône pour le bouton

// Le conteneur principal qui gère l'image de fond et la superposition
const HomeContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  
  /* L'effet de fond de Netflix */
  background-image: 
    linear-gradient(to top, rgba(0, 0, 0, 2) 0, rgba(0, 0, 0, 0.5) 60%, rgba(0, 0, 0, 0.8) 100%),
    url('/home-bg.jpg');
  background-size: cover;
  background-position: center;
`;

// Le contenu central "Héro"
const HeroContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20px;
  color: white;
  z-index: 2; // Pour être au-dessus du fond
`;

const Title = styled.h1`
  font-size: 3.125rem; /* ~50px */
  font-weight: 900;
  max-width: 800px;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.h2`
  font-size: 1.625rem; /* ~26px */
  font-weight: 400;
  margin: 1rem 0;
`;

const CallToAction = styled.p`
  font-size: 1.2rem;
  font-weight: 400;
  margin-top: 1.5rem;
  padding: 0 10%;
`;

// Le formulaire d'email
const EmailForm = styled.form`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  width: 100%;
  max-width: 600px;

  @media (max-width: 950px) {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
`;

const EmailInput = styled.input`
  flex-grow: 1;
  padding: 15px 10px;
  font-size: 1rem;
  border: 1px solid #8c8c8c;
  border-radius: 2px 0 0 2px;

  @media (max-width: 950px) {
    width: 80%;
    max-width: 450px;
    border-radius: 2px;
  }
`;

const StartButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 0 26px;
  font-size: 1.625rem;
  font-weight: 500;
  border: none;
  border-radius: 0 2px 2px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f40612;
  }

  @media (max-width: 950px) {
    font-size: 1rem;
    padding: 12px 20px;
    border-radius: 2px;
  }
`;

const Home = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleStart = (e) => {
    e.preventDefault();
    // on redirige vers la page d'inscription en passant l'email
    if (email) {
      navigate(`/signup?email=${email}`); 
    } else {
      navigate('/signup');
    }
  };

  return (
    <HomeContainer>
      <Header />
      <HeroContent>
        <Title>Films, émissions de télévision et plus encore illimités</Title>
        <Subtitle>À partir de 2.99 USD. Annulez à tout moment.</Subtitle>
        <CallToAction>
          Prêt à regarder ? Entrez votre adresse e-mail pour créer ou redémarrer votre adhésion.
        </CallToAction>
        <EmailForm onSubmit={handleStart}>
          <EmailInput
            type="email"
            placeholder="Adresse courriel"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <StartButton type="submit">
            Démarrer <IoChevronForward />
          </StartButton>
        </EmailForm>
      </HeroContent>
    </HomeContainer>
  );
};

export default Home;