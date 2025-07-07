// Fichier complet : src/layouts/SignupLayout.jsx

import React from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header'; // On importe notre composant Header

// Le conteneur principal de la page
const PageContainer = styled.div`
  background-color: white;
  color: #333;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

// La zone de contenu où chaque étape sera affichée
const MainContent = styled.main`
  flex-grow: 1; // Pousse le footer en bas
`;

// Le footer gris en bas de page
const Footer = styled.footer`
  background-color: #f3f3f3;
  border-top: 1px solid #e6e6e6;
  padding: 30px 5%;
  margin-top: auto;
  color: #737373;
`;

const SignupLayout = () => {
  return (
    <PageContainer>
      {/* 
        ICI, ON AJOUTE LE HEADER :
        - solid={true} lui donne un fond blanc et une bordure.
        - showLoginLink={true} affiche le lien "Connexion".
      */}
      <Header solid={true} showLoginLink={true} />

      <MainContent>
        {/* Outlet affiche le composant de l'étape actuelle (Step1, Step2...) */}
        <Outlet /> 
      </MainContent>

      <Footer>
        <p>Des questions ? Contactez-nous.</p>
      </Footer>
    </PageContainer>
  );
};

export default SignupLayout;