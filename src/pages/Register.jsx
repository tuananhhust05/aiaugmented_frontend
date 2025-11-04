import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import PublicHeader from '../components/PublicHeader/PublicHeader'

const PageContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  position: relative;
`

const MainContent = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 60px 32px;
  width: 100%;
  min-height: calc(100vh - 80px);
`

const RegisterCard = styled.div`
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
  border: 2px solid ${props => props.error ? '#e74c3c' : '#e0e0e0'};
  border-radius: 8px;
  font-size: 14px;
  color: #000000;
  background: #ffffff;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${props => props.error ? '#e74c3c' : '#667eea'};
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

const ErrorMessage = styled.div`
  font-size: 12px;
  color: #e74c3c;
  margin-top: 4px;
`

const PasswordStrengthBar = styled.div`
  width: 100%;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  margin-top: 8px;
  overflow: hidden;
`

const StrengthFill = styled.div`
  height: 100%;
  background: ${props => {
    if (props.strength === 'weak') return '#e74c3c'
    if (props.strength === 'medium') return '#f39c12'
    if (props.strength === 'strong') return '#27ae60'
    return '#e0e0e0'
  }};
  width: ${props => {
    if (props.strength === 'weak') return '33%'
    if (props.strength === 'medium') return '66%'
    if (props.strength === 'strong') return '100%'
    return '0%'
  }};
  transition: all 0.3s;
`

const StrengthText = styled.div`
  font-size: 12px;
  color: ${props => {
    if (props.strength === 'weak') return '#e74c3c'
    if (props.strength === 'medium') return '#f39c12'
    if (props.strength === 'strong') return '#27ae60'
    return '#666666'
  }};
  margin-top: 4px;
  font-weight: 600;
`

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 24px;
`

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  margin-top: 2px;
  cursor: pointer;
`

const CheckboxLabel = styled.label`
  font-size: 14px;
  color: #000000;
  cursor: pointer;
  line-height: 1.5;
  
  a {
    color: #667eea;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`

const SubmitButton = styled.button`
  width: 100%;
  padding: 14px;
  background: ${props => props.disabled ? '#cccccc' : '#000000'};
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background 0.2s;
  margin-bottom: 24px;
  
  &:hover:not(:disabled) {
    background: #333333;
  }
`

const LoginLink = styled.div`
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

const ApiErrorMessage = styled.div`
  font-size: 14px;
  color: #e74c3c;
  margin-bottom: 16px;
  padding: 12px;
  background: #fee;
  border-radius: 6px;
  border: 1px solid #e74c3c;
`

function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: 'tuananhhust05@gmail.com',
    password: '',
    confirmPassword: ''
  })
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const navigate = useNavigate()
  
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
  
  const calculatePasswordStrength = (password) => {
    if (!password || password.length === 0) return { strength: null, text: '' }
    if (password.length < 6) return { strength: 'weak', text: 'Weak' }
    if (password.length < 10) return { strength: 'medium', text: 'Medium' }
    return { strength: 'strong', text: 'Strong' }
  }
  
  const passwordStrength = calculatePasswordStrength(formData.password)
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required'
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match'
    } else if (formData.confirmPassword.length < 8) {
      newErrors.confirmPassword = 'Confirm password must be at least 8 characters long'
    }
    
    if (!acceptTerms) {
      newErrors.terms = 'You must accept the terms and conditions'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    
    try {
      const response = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || errorData.detail || `HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Registration successful, redirect to login
      navigate('/auth/login', { 
        state: { 
          message: 'Registration successful! Please log in with your credentials.' 
        } 
      })
    } catch (error) {
      console.error('Registration error:', error)
      setApiError(error.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }
  
  return (
    <PageContainer>
      <PublicHeader />
      <MainContent>
        <RegisterCard>
          <Title>Create an account</Title>
          <Subtitle>Join us today! It's quick and easy.</Subtitle>
          
          <form onSubmit={handleSubmit}>
            {apiError && <ApiErrorMessage>{apiError}</ApiErrorMessage>}
            
            <FormGroup>
              <Label>Email</Label>
              <InputWrapper>
                <InputIcon>
                  <Mail size={18} />
                </InputIcon>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Enter your email"
                  error={!!errors.email}
                  disabled={isLoading}
                />
              </InputWrapper>
              {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label>Password</Label>
              <InputWrapper>
                <InputIcon>
                  <Lock size={18} />
                </InputIcon>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Enter your password"
                  error={!!errors.password}
                  disabled={isLoading}
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </PasswordToggle>
              </InputWrapper>
              {passwordStrength.strength && (
                <>
                  <PasswordStrengthBar>
                    <StrengthFill strength={passwordStrength.strength} />
                  </PasswordStrengthBar>
                  <StrengthText strength={passwordStrength.strength}>
                    {passwordStrength.text}
                  </StrengthText>
                </>
              )}
              {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label>Confirm Password</Label>
              <InputWrapper>
                <InputIcon>
                  <Lock size={18} />
                </InputIcon>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  placeholder="Re-enter your password"
                  error={!!errors.confirmPassword}
                  disabled={isLoading}
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </PasswordToggle>
              </InputWrapper>
              {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
            </FormGroup>
            
            <CheckboxWrapper>
              <Checkbox
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => {
                  setAcceptTerms(e.target.checked)
                  if (errors.terms) {
                    setErrors(prev => ({ ...prev, terms: '' }))
                  }
                }}
                disabled={isLoading}
              />
              <CheckboxLabel htmlFor="terms">
                Accept terms and conditions. By clicking this checkbox, you agree to the{' '}
                <Link to="/terms">terms and conditions</Link>.
              </CheckboxLabel>
            </CheckboxWrapper>
            {errors.terms && <ErrorMessage style={{ marginTop: '-16px', marginBottom: '16px' }}>{errors.terms}</ErrorMessage>}
            
            <SubmitButton type="submit" disabled={!acceptTerms || isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </SubmitButton>
          </form>
          
          <LoginLink>
            Already have an account? <Link to="/auth/login">Log In</Link>
          </LoginLink>
        </RegisterCard>
      </MainContent>
    </PageContainer>
  )
}

export default Register

