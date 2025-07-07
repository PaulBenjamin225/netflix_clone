// Fichier complet et final : src/components/Header.jsx

import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import NetflixLogo from '../assets/netflix-logo.png';
import { FaSearch, FaBell, FaUserCircle } from 'react-icons/fa';

// --- STYLED COMPONENTS (inchangés) ---

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 20px 4%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
  transition: background-color 0.4s;

  ${({ $isSolid }) => $isSolid && css`
    position: relative;
    background-color: white;
    border-bottom: 1px solid #e6e6e6;
  `}

  ${({ $isScrolled }) => $isScrolled && css`
    background-color: ${({ theme }) => theme.colors.black};
  `}
`;

const Logo = styled.img`
  height: 80px;
  @media (max-width: 950px) { height: 32px; }
  @media (max-width: 550px) { height: 28px; }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
  margin-left: 50px;
  color: white;

  a {
    transition: color 0.2s;
    &:hover { color: #b3b3b3; }
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  color: white;

  svg { cursor: pointer; }
`;

const AuthLink = styled(Link)`
  color: #333;
  font-weight: 700;
  font-size: 1.1rem;

  &:hover { text-decoration: underline; }
`;

// --- REACT COMPONENT (AVEC LA LOGIQUE AMÉLIORÉE) ---

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // --- NOUVELLE LOGIQUE ---
  // Liste des pages qui utilisent le header de navigation complet
  const browsePages = ['/browse', '/series', '/movies', '/latest'];

  // On vérifie si la page actuelle est l'une de ces pages
  const isBrowsePage = browsePages.includes(location.pathname);
  // La logique pour les pages d'inscription ne change pas
  const isSignupPage = location.pathname.startsWith('/signup');
  // -------------------------

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    if (isBrowsePage) {
      window.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isBrowsePage]); // L'effet dépend maintenant de si on est sur une page de type "browse"


  // --- Rendu conditionnel basé sur la nouvelle logique ---

  // 1. Header pour les pages de navigation (Browse, Séries, etc.)
  if (isBrowsePage) {
    return (
      <HeaderContainer $isScrolled={isScrolled}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/browse">
            <Logo src={NetflixLogo} alt="Netflix Logo" />
          </Link>
          <NavLinks>
            <Link to="/browse">Accueil</Link>
            <Link to="/series">Séries</Link>
            <Link to="/movies">Films</Link> {/* Ce lien est prêt pour le futur */}
          </NavLinks>
        </div>
        <UserMenu>
          <FaSearch size={20} />
          <FaBell size={20} />
          <FaUserCircle size={24} />
          {/* Menu déroulant à ajouter ici */}
        </UserMenu>
      </HeaderContainer>
    );
  }

  // 2. Header pour les pages d'inscription
  if (isSignupPage) {
    return (
      <HeaderContainer $isSolid={true}>
        <Link to="/">
          <Logo src={NetflixLogo} alt="Netflix Logo" />
        </Link>
        <AuthLink to="/login">Connexion</AuthLink>
      </HeaderContainer>
    );
  }

  // 3. Header par défaut pour toutes les autres pages (Accueil public, Login)
  return (
    <HeaderContainer>
      <Link to="/">
        <Logo src={NetflixLogo} alt="Netflix Logo" />
      </Link>
    </HeaderContainer>
  );
};

export default Header;