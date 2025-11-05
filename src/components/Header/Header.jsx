import styled from 'styled-components'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Download, Upload, Share2, Home, FileText } from 'lucide-react'
import { useDecisionCanvasStore } from '../../store/useDecisionCanvasStore'
import CreateNodeDialog from '../LeftSidebar/CreateNodeDialog'
import TemplateSelector from '../Summary/TemplateSelector'
import { getCookie } from '../../utils/cookies'
import { isTokenExpired } from '../../utils/jwt'

const HeaderContainer = styled.header`
  height: 64px;
  background: #0f0f0f;
  border-bottom: 1px solid #2a2a2a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 100;
  position: relative;
`

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const Logo = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
`

const WorkspaceName = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
`

const PremiumBadge = styled.span`
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
`

const CenterTabs = styled.div`
  display: flex;
  gap: 8px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`

const Tab = styled.button`
  padding: 8px 16px;
  background: ${props => props.active ? '#1a1a1a' : 'transparent'};
  border: 1px solid ${props => props.active ? '#3a3a3a' : 'transparent'};
  border-radius: 6px;
  color: ${props => props.active ? '#ffffff' : '#888888'};
  font-size: 14px;
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? '#1a1a1a' : '#151515'};
    border-color: ${props => props.active ? '#3a3a3a' : '#2a2a2a'};
  }
`

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const Dropdown = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background: #222222;
    border-color: #3a3a3a;
  }
`

const IconButton = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #222222;
    border-color: #3a3a2a;
  }
`

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #222222;
    border-color: #3a3a3a;
  }
`

const Avatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 10px;
  font-weight: 600;
`

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 12px;
`

const UserName = styled.span`
  font-weight: 600;
  color: #ffffff;
`

const UserEmail = styled.span`
  font-size: 10px;
  color: #888888;
`

function Header() {
  const navigate = useNavigate()
  const { currentView, setCurrentView, currentWorkspace, nodes, edges, nodeConversations } = useDecisionCanvasStore()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)

  const handleSummaryClick = () => {
    // Check if workspace exists
    if (!currentWorkspace?.id) {
      alert('Please select a workspace to generate a summary.')
      return
    }

    // Get authentication token
    const token = getCookie('access_token')
    if (!token || isTokenExpired(token)) {
      alert('Your session has expired. Please log in again.')
      return
    }

    // Show template selector
    setShowTemplateSelector(true)
  }

  const handleTemplateSelect = async (templateId) => {
    setShowTemplateSelector(false)
    setIsGeneratingPDF(true)
    
    try {
      // Get authentication token
      const token = getCookie('access_token')
      if (!token || isTokenExpired(token)) {
        alert('Your session has expired. Please log in again.')
        setIsGeneratingPDF(false)
        return
      }

      // Fetch summary from API
      let summaryData = null
      try {
        const summaryResponse = await fetch(`http://54.79.147.183:8001/summary/workspace/${currentWorkspace.id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!summaryResponse.ok) {
          if (summaryResponse.status === 401) {
            alert('Unauthorized. Please login again.')
            setIsGeneratingPDF(false)
            return
          }
          const errorData = await summaryResponse.json().catch(() => ({}))
          throw new Error(errorData.message || errorData.detail || `HTTP error! status: ${summaryResponse.status}`)
        }

        summaryData = await summaryResponse.json()
      } catch (apiError) {
        console.error('Error fetching summary from API:', apiError)
        alert(`Failed to fetch summary: ${apiError.message}. Please try again.`)
        setIsGeneratingPDF(false)
        return
      }

      // Navigate to editor with template and data
      navigate('/decision/summary-editor', {
        state: {
          templateId,
          summaryData,
          workspaceId: currentWorkspace.id,
          workspaceName: currentWorkspace.name
        }
      })
    } catch (error) {
      console.error('Error:', error)
      alert(`Failed to load summary: ${error.message}`)
    } finally {
      setIsGeneratingPDF(false)
    }
  }


  return (
    <>
      <HeaderContainer>
      <LeftSection>
        <Logo>◆</Logo>
        <WorkspaceName>
          {currentWorkspace?.name || 'Workspace'}
          {currentWorkspace?.isPremium && <PremiumBadge>PREMIUM</PremiumBadge>}
        </WorkspaceName>
      </LeftSection>

      <CenterTabs>
        <Tab
          active={currentView === 'decision-canvas'}
          onClick={() => setCurrentView('decision-canvas')}
        >
          Exploration Map
        </Tab>
        <Tab
          active={currentView === 'executive-report'}
          onClick={() => setCurrentView('executive-report')}
        >
          Last-Mile Brief
        </Tab>
      </CenterTabs>

      <RightSection>
        <IconButton 
          title="Summary" 
          onClick={handleSummaryClick}
          disabled={isGeneratingPDF}
          style={{ 
            padding: '6px 12px', 
            fontSize: '14px', 
            fontWeight: '600',
            width: 'auto',
            minWidth: '100px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            opacity: isGeneratingPDF ? 0.6 : 1,
            cursor: isGeneratingPDF ? 'not-allowed' : 'pointer'
          }}
        >
          <FileText size={16} />
          {isGeneratingPDF ? 'Loading...' : 'Summary'}
        </IconButton>
        {/* <UserProfile>
          <Avatar>CF</Avatar>
          <UserInfo>
            <UserName>Celeste Farm</UserName>
            <UserEmail>celeste.fcp@gmail.com</UserEmail>
          </UserInfo>
        </UserProfile> */}
        {/* <IconButton 
          title="Create New Node" 
          onClick={() => setShowCreateDialog(true)}
          style={{ padding: '6px 12px', fontSize: '14px', fontWeight: '600' }}
        >
          Create New Node
        </IconButton> */}
      </RightSection>
    </HeaderContainer>
    {showCreateDialog && (
      <CreateNodeDialog onClose={() => setShowCreateDialog(false)} />
    )}
    {showTemplateSelector && (
      <TemplateSelector
        onClose={() => setShowTemplateSelector(false)}
        onSelectTemplate={handleTemplateSelect}
      />
    )}
    </>
  )
}

export default Header

