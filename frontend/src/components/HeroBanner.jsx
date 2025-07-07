// Fichier complet : src/components/HeroBanner.jsx

import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaPlay, FaInfoCircle } from 'react-icons/fa';

const BannerContainer = styled.div`
  height: 90vh;
  position: relative;
  color: white;
  display: flex;
  align-items: center;
  padding-top: 60px;
`;

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center top;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(to right, rgba(20,20,20,1) 0%, rgba(20,20,20,0) 50%);
  }
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40%;
    background: linear-gradient(to top, #141414, transparent);
  }
`;

const InfoContainer = styled.div`
  position: relative;
  z-index: 10;
  padding-left: 4%;
  max-width: 45%;
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: 900;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.45);
`;

const Description = styled.p`
  font-size: 1.2rem;
  line-height: 1.5;
  margin: 1rem 0;
  max-width: 500px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const ActionButton = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 1.2rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  background-color: ${props => props.primary ? 'white' : 'rgba(109, 109, 110, 0.7)'};
  color: ${props => props.primary ? 'black' : 'white'};
  
  &:hover {
    opacity: 0.8;
  }
`;

const HeroBanner = ({ item }) => {
  if (!item) return null;

  // LOGIQUE SIMPLIFIÉE : On utilise directement le chemin de notre DB
  const backdropPath = item.backdrop_url || '/placeholder-bg.jpg';

  return (
    <BannerContainer>
      <BackgroundImage src={backdropPath} />
      <InfoContainer>
        <Title>{item.title}</Title>
        <Description>{item.description}</Description>
        <ButtonContainer>
          <Link to={`/watch/${item.id}`}>
            <ActionButton primary>
              <FaPlay /> Lecture
            </ActionButton>
          </Link>
          <ActionButton>
            <FaInfoCircle /> Plus d'infos
          </ActionButton>
        </ButtonContainer>
      </InfoContainer>
    </BannerContainer>
  );
};

export default HeroBanner;