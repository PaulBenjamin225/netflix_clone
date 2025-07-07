import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import apiClient from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';

const PlanFormContainer = styled.div`
  width: 100%;
  max-width: 980px;
  margin: 40px auto;
  padding: 0 20px;
`;

const StepIndicator = styled.p`
  font-size: 0.8rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 10px 0;
`;

const CheckList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 20px 0;
`;

const ListItem = styled.li`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
    font-size: 1.1rem;
`;

const PlanGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
`;

const PlanCard = styled.div`
  width: 180px;
  height: 180px;
  background-color: ${({ selected, theme }) => selected ? theme.colors.primary : '#e8f0fe'};
  color: ${({ selected, theme }) => selected ? 'white' : theme.colors.primary};
  border: 2px solid ${({ selected, theme }) => selected ? theme.colors.primary : 'transparent'};
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  text-align: center;
  transition: all 0.2s;

  h3 { font-size: 1.2rem; }
  p { font-size: 1rem; font-weight: bold; }
`;

const NextButton = styled.button`
  display: block;
  width: 100%;
  max-width: 440px;
  margin: 40px auto;
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 4px;
  padding: 16px;
  color: ${({ theme }) => theme.colors.white};
  font-size: 1.5rem;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background: #f40612;
  }
`;

const SignupStep2 = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get('/payments/plans').then(res => {
      setPlans(res.data);
      if (res.data.length > 0) {
        const standardPlan = res.data.find(p => p.name === 'Standard') || res.data[0];
        setSelectedPlan(standardPlan.id);
      }
    }).catch(err => console.error(err));
  }, []);
  
  const handleNext = () => {
  if (selectedPlan) {
    localStorage.setItem('selectedPlanId', selectedPlan);
    // On active la redirection
    navigate('/signup/payment'); 
  }
};

  return (
    <PlanFormContainer>
      <StepIndicator>ÉTAPE 2 SUR 3</StepIndicator>
      <Title>Choisissez votre forfait.</Title>
      
      <CheckList>
        <ListItem><FaCheck color="#E50914" /> Sans engagement. Annulez à tout moment.</ListItem>
        <ListItem><FaCheck color="#E50914" /> Tous les programmes de Netflix à un prix très attractif.</ListItem>
        <ListItem><FaCheck color="#E50914" /> Un accès sur tous vos appareils.</ListItem>
      </CheckList>
      
      <PlanGrid>
        {plans.map(plan => (
          <PlanCard 
            key={plan.id}
            selected={selectedPlan === plan.id}
            onClick={() => setSelectedPlan(plan.id)}
          >
            <h3>{plan.name}</h3>
            <p>{plan.price} XOF</p>
          </PlanCard>
        ))}
      </PlanGrid>
      
      <NextButton onClick={handleNext}>Suivant</NextButton>
    </PlanFormContainer>
  );
};

export default SignupStep2;