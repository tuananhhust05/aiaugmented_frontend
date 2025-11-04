import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import PublicHeader from '../components/PublicHeader/PublicHeader'
import { setCookie } from '../utils/cookies'

const PageContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #ffffff;
`

const MainContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 32px;
`

const LoginCard = styled.div`
  width: 100%;
  max-width: 440px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  padding: 40px;
`

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 8px;
`

const Subtitle = styled.p`
  font-size: 16px;
  color: #666666;
  margin-bottom: 32px;
`

const FormGroup = styled.div`
  margin-bottom: 24px;
`

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 8px;
`

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

const InputIcon = styled.div`
  position: absolute;
  left: 16px;
  color: #666666;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Input = styled.input`
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  color: #000000;
  background: #ffffff;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
  
  &::placeholder {
    color: #999999;
  }
`

const PasswordToggle = styled.button`
  position: absolute;
  right: 16px;
  background: transparent;
  border: none;
  color: #666666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  
  &:hover {
    color: #000000;
  }
`

const ForgotPasswordLink = styled(Link)`
  display: inline-block;
  font-size: 14px;
  color: #667eea;
  text-decoration: none;
  margin-top: 8px;
  margin-left: auto;
  
  &:hover {
    text-decoration: underline;
  }
`

const RememberMe = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
`

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`

const CheckboxLabel = styled.label`
  font-size: 14px;
  color: #000000;
  cursor: pointer;
`

const SubmitButton = styled.button`
  width: 100%;
  padding: 14px;
  background: #000000;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-bottom: 24px;
  
  &:hover:not(:disabled) {
    background: #333333;
  }
  
  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`

const ErrorMessage = styled.div`
  font-size: 14px;
  color: #e74c3c;
  margin-bottom: 16px;
  padding: 12px;
  background: #fee;
  border-radius: 6px;
  border: 1px solid #e74c3c;
`

const SuccessMessage = styled.div`
  font-size: 14px;
  color: #27ae60;
  margin-bottom: 16px;
  padding: 12px;
  background: #d4edda;
  border-radius: 6px;
  border: 1px solid #27ae60;
`

const RegisterLink = styled.div`
  text-align: center;
  font-size: 14px;
  color: #666666;
  
  a {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('tuananhhust05@gmail.com')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  
  // Enable scrolling on body when component mounts
  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow
    const originalRootHeight = document.getElementById('root')?.style.height
    
    // Enable scrolling
    document.body.style.overflow = 'auto'
    const root = document.getElementById('root')
    if (root) {
      root.style.height = 'auto'
      root.style.minHeight = '100vh'
    }
    
    // Cleanup: restore original styles when component unmounts
    return () => {
      document.body.style.overflow = originalBodyOverflow
      if (root) {
        root.style.height = originalRootHeight || ''
        root.style.minHeight = ''
      }
    }
  }, [])
  
  useEffect(() => {
    // Check if redirected from register with success message
    if (location.state?.message) {
      setSuccessMessage(location.state.message)
      // Clear state after showing
      window.history.replaceState({}, document.title)
    }
  }, [location.state])
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || errorData.detail || `HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.access_token) {
        // Save token to cookie
        setCookie('access_token', data.access_token, rememberMe ? 30 : 7) // 30 days if remember me, else 7 days
        
        // Navigate to dashboard after login
        navigate('/dashboard')
      } else {
        throw new Error('No access token received')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError(error.message || 'Login failed. Please check your credentials and try again.')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <PageContainer>
      <PublicHeader />
      <MainContent>
        <LoginCard>
          <Title>Welcome back</Title>
          <Subtitle>Log in to your account to continue.</Subtitle>
          
          <form onSubmit={handleSubmit}>
            {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <FormGroup>
              <Label>Email</Label>
              <InputWrapper>
                <InputIcon>
                  <Mail size={18} />
                </InputIcon>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </InputWrapper>
            </FormGroup>
            
            <FormGroup>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <Label>Password</Label>
                <ForgotPasswordLink to="/auth/forgot-password">
                  Forgot password?
                </ForgotPasswordLink>
              </div>
              <InputWrapper>
                <InputIcon>
                  <Lock size={18} />
                </InputIcon>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </PasswordToggle>
              </InputWrapper>
            </FormGroup>
            
            <RememberMe>
              <Checkbox
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <CheckboxLabel htmlFor="remember">Remember me</CheckboxLabel>
            </RememberMe>
            
            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Log In'}
            </SubmitButton>
          </form>
          
          <RegisterLink>
            Don't have an account? <Link to="/auth/register">Register</Link>
          </RegisterLink>
        </LoginCard>
      </MainContent>
    </PageContainer>
  )
}

export default Login

