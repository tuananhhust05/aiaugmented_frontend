import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Moon, User, LogOut } from 'lucide-react'
import { getCookie, deleteCookie } from '../../utils/cookies'
import { decodeJWT, isTokenExpired } from '../../utils/jwt'

const HeaderContainer = styled.header`
  width: 100%;
  background: #1a1a2e;
  padding: 16px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const LogoIcon = styled.div`
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #8b4513 0%, #d2691e 100%);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
`

const LogoText = styled(Link)`
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
`

const BetaBadge = styled.span`
  background: #d4a574;
  color: #000000;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
`

const NavLinks = styled.nav`
  display: flex;
  gap: 24px;
  align-items: center;
`

const NavLink = styled(Link)`
  color: #ffffff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s;
  
  &:hover {
    color: #cccccc;
  }
`

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const Button = styled(Link)`
  padding: 8px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
`

const LoginButton = styled(Button)`
  background: #ffffff;
  color: #000000;
  
  &:hover {
    background: #f0f0f0;
  }
`

const RegisterButton = styled(Button)`
  background: #000000;
  color: #ffffff;
  
  &:hover {
    background: #333333;
  }
`

const DarkModeButton = styled.button`
  background: transparent;
  border: none;
  color: #ffffff;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  
  &:hover {
    color: #cccccc;
  }
`

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #ffffff;
  font-size: 14px;
`

const UserEmail = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
`

const LogoutButton = styled.button`
  padding: 8px 16px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
  }
`

function PublicHeader() {
  const location = useLocation()
  const navigate = useNavigate()
  const [userEmail, setUserEmail] = useState(null)
  
  useEffect(() => {
    // Check if user is logged in
    const token = getCookie('access_token')
    if (token && !isTokenExpired(token)) {
      const decoded = decodeJWT(token)
      if (decoded && decoded.sub) {
        setUserEmail(decoded.sub)
      }
    } else if (token) {
      // Token expired, remove it
      deleteCookie('access_token')
      setUserEmail(null)
    }
  }, [location.pathname]) // Re-check when route changes
  
  const handleLogout = () => {
    deleteCookie('access_token')
    setUserEmail(null)
    navigate('/')
  }
  
  return (
    <HeaderContainer>
      <LeftSection>
        <LogoText to="/">
          <LogoIcon />
          AI-Augmented
        </LogoText>
        <BetaBadge>BETA</BetaBadge>
      </LeftSection>
      
      <NavLinks>
        <NavLink to="/" style={{ color: location.pathname === '/' ? '#ffffff' : '#ffffff' }}>
          Home
        </NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/agents">Agents</NavLink>
        <NavLink to="/pricing">Pricing</NavLink>
      </NavLinks>
      
      <RightSection>
        {userEmail ? (
          <>
            <UserInfo>
              <UserEmail>
                <User size={16} />
                {userEmail}
              </UserEmail>
            </UserInfo>
            <LogoutButton onClick={handleLogout}>
              <LogOut size={16} />
              Log Out
            </LogoutButton>
          </>
        ) : (
          <>
            <LoginButton to="/auth/login">Log In</LoginButton>
            <RegisterButton to="/auth/register">Register</RegisterButton>
          </>
        )}
        <DarkModeButton title="Toggle dark mode">
          <Moon size={20} />
        </DarkModeButton>
      </RightSection>
    </HeaderContainer>
  )
}

export default PublicHeader

