// src/pages/Browse.jsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import apiClient from '../api/axios';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import Row from '../components/Row'; 

const BrowseContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.black};
`;

const RowsContainer = styled.div`
  padding: 0 0 50px 0;
  margin-top: -150px; /* Fait remonter les lignes sur le dégradé du banner */
  position: relative;
  z-index: 12;
`;

const LoadingMessage = styled.p`/*...*/`;


const Browse = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Le contenu en vedette sera le premier film de la première catégorie
  const featuredContent = content[0]?.contents[0];

  useEffect(() => {
    const fetchBrowseContent = async () => {
      try {
        const response = await apiClient.get('/content/browse');
        setContent(response.data);
      } catch (err) {
        setError('Impossible de charger le contenu.');
      } finally {
        setLoading(false);
      }
    };
    fetchBrowseContent();
  }, []);

  if (loading) return <LoadingMessage>Chargement...</LoadingMessage>;
  if (error) return <LoadingMessage>{error}</LoadingMessage>;

  return (
    <BrowseContainer>
      <Header type="browse" />
      <HeroBanner item={featuredContent} />
      
      <RowsContainer>
        {content.map((genreRow) => (
          genreRow.contents.length > 0 && (
            <Row 
              key={genreRow.genre} 
              title={genreRow.genre} 
              items={genreRow.contents} 
            />
          )
        ))}
      </RowsContainer>
    </BrowseContainer>
  );
};

export default Browse;