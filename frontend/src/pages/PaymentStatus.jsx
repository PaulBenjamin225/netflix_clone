import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const StatusContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
`;

const PaymentStatus = () => {
  const [status, setStatus] = useState('pending');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Le backend (via le webhook) est le seul qui valide réellement le paiement.
    // Le frontend affiche simplement un message de transition.
    // Après quelques secondes, on redirige vers les profils.
    
    // On pourrait vérifier le statut ici en appelant une API, mais pour l'instant
    // on fait confiance au webhook et on assume que tout s'est bien passé.
    
    setStatus('success');

    const timer = setTimeout(() => {
      // On redirige vers une page de sélection de profil (à créer)
      navigate('/profiles');
    }, 3000); // Attendre 3 secondes

    return () => clearTimeout(timer); // Nettoyer le timer
  }, [navigate]);

  return (
    <StatusContainer>
      <div>
        {status === 'pending' && <h1>Vérification de votre paiement...</h1>}
        {status === 'success' && <>
          <h1>Paiement réussi !</h1>
          <p>Bienvenue sur Netflix. Vous allez être redirigé...</p>
        </>}
        {status === 'error' && <>
          <h1>Le paiement a échoué.</h1>
          <p>Veuillez réessayer.</p>
        </>}
      </div>
    </StatusContainer>
  );
};

export default PaymentStatus;