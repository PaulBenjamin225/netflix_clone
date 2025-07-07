// Fichier : src/pages/MoviesPage.jsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import apiClient from '../api/axios';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import Row from '../components/Row';

// On peut réutiliser tous les styles des autres pages de catalogue
const PageContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.black};
  min-height: 100vh;
  color: white;
`;

const ContentWrapper = styled.div`
  padding-top: 70px;
`;

const RowsContainer = styled.div`
  padding: 0 0 50px 0;
  margin-top: -150px;
  position: relative;
  z-index: 12;
`;

const MessageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Message = styled.p`
  font-size: 1.5rem;
  text-align: center;
`;

const MoviesPage = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const featuredContent = content[0]?.contents[0];

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        // On appelle le nouvel endpoint pour les films
        const response = await apiClient.get('/content/movies');
        setContent(response.data);
      } catch (err) {
        setError('Impossible de charger les films.');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (loading) {
    return ( <PageContainer><Header /><MessageContainer><Message>Chargement des films...</Message></MessageContainer></PageContainer> );
  }

  if (error) {
    return ( <PageContainer><Header /><MessageContainer><Message>{error}</Message></MessageContainer></PageContainer> );
  }

  if (!content || content.length === 0) {
    return ( <PageContainer><Header /><MessageContainer><Message>Aucun film disponible pour le moment.</Message></MessageContainer></PageContainer> );
  }
  
  return (
    <PageContainer>
      <Header />
      <ContentWrapper>
        {featuredContent && <HeroBanner item={featuredContent} />}
        
        <RowsContainer style={!featuredContent ? { marginTop: '0' } : {}}>
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
      </ContentWrapper>
    </PageContainer>
  );
};

export default MoviesPage;