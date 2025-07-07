// src/pages/Watch.jsx

import React from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const WatchContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: black;
`;

const BackButton = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  color: white;
  cursor: pointer;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.2rem;
  
  &:hover {
    opacity: 0.8;
  }
`;

const VideoPlayer = styled.video`
  width: 100%;
  height: 100%;
  object-fit: contain; /* Ou 'cover' selon l'effet désiré */
`;

const Watch = () => {
  const { contentId } = useParams(); // Récupère l'ID depuis l'URL (ex: /watch/123)
  const navigate = useNavigate();

  // Pour l'instant, on utilise une vidéo placeholder.
  // Dans le futur, vous feriez un appel API pour récupérer la vraie URL de la vidéo
  // en utilisant `contentId`.
  const videoUrl = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  return (
    <WatchContainer>
      <BackButton onClick={() => navigate(-1)}> {/* navigate(-1) revient à la page précédente */}
        <FaArrowLeft />
        Retour
      </BackButton>
      <VideoPlayer src={videoUrl} autoPlay controls />
    </WatchContainer>
  );
};

export default Watch;