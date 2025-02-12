import React from 'react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'

const Nav = styled.nav`
  background: var(--color-primary);
  border-bottom: var(--border-thick);
  padding: 1rem;
  margin-bottom: 2rem;
`

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Logo = styled.h1`
  font-size: 1.5rem;
  margin: 0;
`

const NavLink = styled(Link)`
  color: var(--color-text);
  text-decoration: none;
  font-weight: bold;
  padding: 0.5rem 1rem;
  background: var(--color-secondary);
  border: var(--border-thick);
  box-shadow: var(--shadow-offset) var(--shadow-offset) 0 var(--color-text);
  transform: translate(-2px, -2px);
  transition: transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out;

  &:active {
    transform: translate(0, 0);
    box-shadow: 0 0 0 var(--color-text);
  }
`

function Navigation() {
  return (
    <Nav>
      <NavContainer>
        <Logo>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            HABIT TRACKER
          </Link>
        </Logo>
        <NavLink to="/add">+ New Habit</NavLink>
      </NavContainer>
    </Nav>
  )
}

export default Navigation
