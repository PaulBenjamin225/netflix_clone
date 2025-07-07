// Fichier complet et mis à jour : src/components/Row.jsx

import React from 'react';
import styled from 'styled-components';
import Card from './Card';
import Slider from 'react-slick'; // <-- Importer le Slider
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// --- STYLED COMPONENTS ---

const RowContainer = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h2`
  font-size: 1.4rem;
  font-weight: 700;
  color: #e5e5e5;
  margin-bottom: 15px;
  padding-left: 4%;
`;

// On va styliser le conteneur du Slider pour que les flèches soient bien positionnées
const SliderWrapper = styled.div`
  position: relative;
  
  .slick-slider {
    padding: 0 4%; /* On garde le padding ici */
  }

  /* Style personnalisé pour les flèches */
  .slick-arrow {
    background-color: rgba(20, 20, 20, 0.5);
    border-radius: 50%;
    width: 50px;
    height: 100%;
    z-index: 25;
    
    &:before {
      content: ''; /* On cache la flèche par défaut */
    }
  }

  .slick-prev {
    left: -20px;
    &:hover { background-color: rgba(20, 20, 20, 0.7); }
  }

  .slick-next {
    right: -20px;
    &:hover { background-color: rgba(20, 20, 20, 0.7); }
  }
`;

// --- Composants pour les flèches personnalisées ---
const NextArrow = ({ onClick }) => (
  <div className="slick-next" onClick={onClick}>
    <FaChevronRight style={{ color: 'white', fontSize: '24px', position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)' }} />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div className="slick-prev" onClick={onClick}>
    <FaChevronLeft style={{ color: 'white', fontSize: '24px', position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)' }} />
  </div>
);


// --- REACT COMPONENT ---

const Row = ({ title, items }) => {

  // Configuration pour react-slick
  const settings = {
    dots: false,      // On ne veut pas de points de navigation
    infinite: true,  // Le carrousel boucle
    speed: 500,       // Vitesse de l'animation
    slidesToShow: 6,  // Nombre de cartes à montrer en même temps
    slidesToScroll: 6,// Nombre de cartes à faire défiler au clic
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    // Configuration responsive
    responsive: [
      {
        breakpoint: 1400,
        settings: { slidesToShow: 5, slidesToScroll: 5 }
      },
      {
        breakpoint: 1100,
        settings: { slidesToShow: 4, slidesToScroll: 4 }
      },
      {
        breakpoint: 800,
        settings: { slidesToShow: 3, slidesToScroll: 3 }
      },
      {
        breakpoint: 500,
        settings: { slidesToShow: 2, slidesToScroll: 2 }
      }
    ]
  };

  return (
    <RowContainer>
      <Title>{title}</Title>
      <SliderWrapper>
        <Slider {...settings}>
          {items.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </Slider>
      </SliderWrapper>
    </RowContainer>
  );
};

export default Row;