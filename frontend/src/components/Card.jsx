// Fichier complet, avec effet de survol ET boutons : src/components/Card.jsx

import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaThumbsUp } from 'react-icons/fa';

// Le conteneur qui garde la place dans la ligne.
const CardWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 250px;
  margin-right: 10px;
  height: 140.63px;
  cursor: pointer;
`;

// La carte visible qui va s'animer.
const CardContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  overflow: hidden;
  background-color: #181818;
  z-index: 10;
  
  /* L'animation est de retour ! */
  transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
  transform-origin: center;

  /* On utilise isHovered pour déclencher l'animation */
  ${({ isHovered }) => isHovered && `
    transform: scale(1.3);
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.75);
    z-index: 20;
  `}
`;

const Poster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

// La boîte d'information qui apparaît au survol
const InfoBox = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%);
  padding: 15px;
  box-sizing: border-box; /* S'assure que le padding ne dépasse pas */

  /* On l'affiche uniquement quand la carte est survolée */
  opacity: 0;
  transition: opacity 0.3s ease;
  ${CardContainer}:hover & {
    opacity: 1;
  }
`;

const Title = styled.h3`
  color: white;
  font-size: 1rem;
  margin: 0 0 10px 0;
  text-shadow: 1px 1px 2px black;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionIcon = styled.div`
  background: rgba(42, 42, 42, 0.6);
  border: 2px solid rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  color: white;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;

  &.play {
    background: white;
    color: black;
  }
  
  &:hover {
    border-color: white;
  }
`;

// --- LE COMPOSANT REACT ---

const Card = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false); // L'état est de retour !
  const navigate = useNavigate();
  
  const posterPath = item.poster_url || '/placeholder.jpg';

  // Le timer est aussi de retour pour une meilleure UX
  let hoverTimeout;
  const handleMouseEnter = () => {
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => setIsHovered(true), 300);
  };
  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout);
    setIsHovered(false);
  };

  const handlePlay = (e) => {
    e.stopPropagation();
    navigate(`/watch/${item.id}`);
  };

  const handleLike = (e) => {
    e.stopPropagation();
    alert(`Vous avez aimé "${item.title}"`);
  };

  return (
    // On met les gestionnaires de survol sur le wrapper
    <CardWrapper onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handlePlay}>
      <CardContainer isHovered={isHovered}>
        <Poster src={posterPath} alt={item.title} />

        <InfoBox>
          <Title>{item.title}</Title>
          <ButtonContainer>
            <ActionIcon className="play" onClick={handlePlay}>
              <FaPlay />
            </ActionIcon>
            <ActionIcon onClick={handleLike}>
              <FaThumbsUp />
            </ActionIcon>
          </ButtonContainer>
        </InfoBox>
      </CardContainer>
    </CardWrapper>
  );
};

export default Card;