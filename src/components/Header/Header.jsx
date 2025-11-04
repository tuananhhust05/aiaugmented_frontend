import styled from 'styled-components'
import { useState } from 'react'
import { ChevronDown, Download, Upload, Share2, Home, FileText } from 'lucide-react'
import { useDecisionCanvasStore } from '../../store/useDecisionCanvasStore'
import CreateNodeDialog from '../LeftSidebar/CreateNodeDialog'
import jsPDF from 'jspdf'

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
  const { currentView, setCurrentView, currentWorkspace, nodes, nodeConversations } = useDecisionCanvasStore()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true)
    try {
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      let yPosition = 20
      const margin = 20
      const lineHeight = 7
      const maxWidth = pageWidth - 2 * margin

      // Helper function to add text with word wrap
      const addText = (text, fontSize = 12, isBold = false, color = [0, 0, 0]) => {
        doc.setFontSize(fontSize)
        doc.setTextColor(color[0], color[1], color[2])
        if (isBold) {
          doc.setFont(undefined, 'bold')
        } else {
          doc.setFont(undefined, 'normal')
        }

        const lines = doc.splitTextToSize(text, maxWidth)
        
        // Check if we need a new page
        if (yPosition + (lines.length * lineHeight) > pageHeight - margin) {
          doc.addPage()
          yPosition = 20
        }

        lines.forEach((line) => {
          doc.text(line, margin, yPosition)
          yPosition += lineHeight
        })

        yPosition += 3 // Add spacing after text
      }

      // Title
      addText('BÁO CÁO TỔNG HỢP', 18, true, [0, 0, 0])
      
      // Workspace name
      addText(`Workspace: ${currentWorkspace?.name || 'N/A'}`, 14, true, [0, 0, 0])
      
      // Date
      addText(`Ngày tạo: ${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN')}`, 10, false, [100, 100, 100])
      
      yPosition += 5

      // Iterate through nodes
      if (nodes.length === 0) {
        addText('Chưa có node nào trong workspace này.', 12, false, [100, 100, 100])
      } else {
        nodes.forEach((node, nodeIndex) => {
          // Check if we need a new page
          if (yPosition > pageHeight - 60) {
            doc.addPage()
            yPosition = 20
          }

          // Node header
          addText(`Node ${nodeIndex + 1}: ${node.data?.label || node.id}`, 14, true, [0, 0, 0])
          addText(`Agent: ${node.data?.agent || 'N/A'}`, 11, false, [50, 50, 50])
          
          yPosition += 2

          // Get messages for this node
          const messages = nodeConversations[node.id] || []
          
          if (messages.length === 0) {
            addText('  - Chưa có tin nhắn nào', 10, false, [150, 150, 150])
          } else {
            messages.forEach((message) => {
              const sender = message.type === 'user' ? 'Bạn' : (message.agent || 'AI')
              const content = message.content || ''
              
              addText(`  [${sender}]: ${content}`, 10, false, [0, 0, 0])
            })
          }

          yPosition += 5
        })
      }

      // Save PDF
      const fileName = `BaoCaoTongHop_${currentWorkspace?.name || 'Workspace'}_${new Date().toISOString().split('T')[0]}.pdf`
      doc.save(fileName)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Có lỗi xảy ra khi tạo PDF. Vui lòng thử lại.')
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
          onClick={handleGeneratePDF}
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
          {isGeneratingPDF ? 'Generating...' : 'Summary'}
        </IconButton>
        <UserProfile>
          <Avatar>CF</Avatar>
          <UserInfo>
            <UserName>Celeste Farm</UserName>
            <UserEmail>celeste.fcp@gmail.com</UserEmail>
          </UserInfo>
        </UserProfile>
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
    </>
  )
}

export default Header

