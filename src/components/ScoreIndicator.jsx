import React from 'react'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`

const ScoreContainer = styled.div`
  text-align: center;
  margin: 2rem 0;
  padding: 2rem;
  background: var(--color-primary);
  border: var(--border-thick);
  box-shadow: var(--shadow-offset) var(--shadow-offset) 0 var(--color-text);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(0,0,0,0.05) 10px,
      rgba(0,0,0,0.05) 20px
    );
  }
`

const ScoreValue = styled.div`
  font-size: 4rem;
  font-weight: 900;
  color: var(--color-text);
  text-shadow: 2px 2px 0 var(--color-secondary);
  animation: ${pulse} 0.5s ease-in-out;
  position: relative;
  z-index: 1;
`

const ScoreLabel = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 0.5rem;
  position: relative;
  z-index: 1;
`

function ScoreIndicator({ score }) {
  return (
    <ScoreContainer>
      <ScoreValue>{score}</ScoreValue>
      <ScoreLabel>CURRENT SCORE</ScoreLabel>
    </ScoreContainer>
  )
}

export default ScoreIndicator
