// Fichier complet et final : src/pages/SeriesPage.jsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import apiClient from '../api/axios';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import Row from '../components/Row';

// On utilise les mêmes styles que pour la page Browse pour la cohérence
const PageContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.black};
  min-height: 100vh;
  color: white;
`;

const ContentWrapper = styled.div`
  /* Ajoute de l'espace en haut pour ne pas être caché par le Header fixe */
  padding-top: 70px;
`;

const RowsContainer = styled.div`
  padding: 0 0 50px 0;
  /* L'effet de superposition sur le dégradé du banner */
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

const SeriesPage = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get('/content/series');
        setContent(response.data);
      } catch (err) {
        console.error("Erreur API lors du chargement des séries:", err);
        setError('Impossible de charger les séries.');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  // On détermine le contenu en vedette de manière sécurisée
  const featuredContent = content && content.length > 0 && content[0].contents && content[0].contents.length > 0
    ? content[0].contents[0]
    : null;

  // --- GESTION DES DIFFÉRENTS ÉTATS D'AFFICHAGE ---

  // 1. Pendant le chargement
  if (loading) {
    return (
      <PageContainer>
        <Header />
        <MessageContainer>
          <Message>Chargement des séries...</Message>
        </MessageContainer>
      </PageContainer>
    );
  }

  // 2. En cas d'erreur réseau
  if (error) {
    return (
      <PageContainer>
        <Header />
        <MessageContainer>
          <Message>{error}</Message>
        </MessageContainer>
      </PageContainer>
    );
  }

  // 3. Si tout s'est bien passé mais qu'il n'y a rien à afficher
  if (!content || content.length === 0) {
    return (
      <PageContainer>
        <Header />
        <MessageContainer>
          <Message>Aucune série n'est disponible pour le moment.</Message>
        </MessageContainer>
      </PageContainer>
    );
  }
  
  // 4. Cas nominal : on a du contenu à afficher
  return (
    <PageContainer>
      <Header />
      <ContentWrapper>
        {/* Le HeroBanner ne s'affiche que si on a un contenu en vedette */}
        {featuredContent && <HeroBanner item={featuredContent} />}
        
        {/* Si pas de banner, on ajuste la marge des lignes */}
        <RowsContainer style={!featuredContent ? { marginTop: '0' } : {}}>
          {content.map((genreRow) => (
            // On s'assure que la ligne a bien du contenu avant de l'afficher
            genreRow.contents && genreRow.contents.length > 0 && (
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

export default SeriesPage;