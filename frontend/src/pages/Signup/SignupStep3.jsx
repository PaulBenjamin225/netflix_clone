import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/axios';
import { FaLock } from 'react-icons/fa';

const PaymentContainer = styled.div`
  width: 100%;
  max-width: 440px;
  margin: 60px auto;
  padding: 0 20px;
  text-align: center;
`;

const IconWrapper = styled.div`
  border: 2px solid #ffb53f;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 20px auto;
`;

const StepIndicator = styled.p`
  font-size: 0.8125rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0.5rem 0;
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  line-height: 1.5;
  margin: 1rem 0;
`;

const Summary = styled.div`
  background-color: #f3f3f3;
  padding: 15px;
  border-radius: 4px;
  margin: 20px 0;
  text-align: left;
`;

const PaymentButton = styled.button`
  width: 100%;
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 4px;
  padding: 16px;
  color: white;
  font-size: 1.5rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const SignupStep3 = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [planDetails, setPlanDetails] = useState(null);

  useEffect(() => {
    const planId = localStorage.getItem('selectedPlanId');
    if (!planId) {
      navigate('/signup/planform');
    } else {
      apiClient.get('/payments/plans').then(res => {
        const selected = res.data.find(p => p.id == planId);
        setPlanDetails(selected);
      });
    }
  }, [navigate]);
  
  const handleInitiatePayment = async () => {
    setLoading(true);
    const planId = localStorage.getItem('selectedPlanId');
    try {
      const response = await apiClient.post('/payments/initiate-payment', { planId });
      window.location.href = response.data.payment_url;
    } catch (error) {
      console.error("Erreur lors de l'initiation du paiement", error);
      alert("Impossible de démarrer le processus de paiement. Veuillez réessayer.");
      setLoading(false);
    }
  };

  return (
    <PaymentContainer>
      <IconWrapper>
        <FaLock size={24} color="#ffb53f" />
      </IconWrapper>
      <StepIndicator>ÉTAPE <strong>3</strong> SUR <strong>3</strong></StepIndicator>
      <Title>Configurez votre paiement</Title>
      <Subtitle>
        Votre abonnement commence dès que vous configurez un moyen de paiement.<br/>
        <strong>Sans engagement. Annulez en ligne à tout moment.</strong>
      </Subtitle>
      
      {planDetails && (
        <Summary>
          <h3>Récapitulatif :</h3>
          <p>Plan {planDetails.name} - {planDetails.price} XOF/mois</p>
        </Summary>
      )}

      <PaymentButton onClick={handleInitiatePayment} disabled={loading}>
        {loading ? 'Chargement...' : <><span>Paiement sécurisé CinetPay</span> <FaLock /></>}
      </PaymentButton>
    </PaymentContainer>
  );
};

export default SignupStep3;