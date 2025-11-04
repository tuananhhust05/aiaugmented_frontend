import styled from 'styled-components'
import { useState } from 'react'
import { ChevronDown, Download, Upload, Share2, Home, FileText } from 'lucide-react'
import { useDecisionCanvasStore } from '../../store/useDecisionCanvasStore'
import CreateNodeDialog from '../LeftSidebar/CreateNodeDialog'
import jsPDF from 'jspdf'
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
  const { currentView, setCurrentView, currentWorkspace, nodes, nodeConversations } = useDecisionCanvasStore()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true)
    try {
      // Check if workspace exists
      if (!currentWorkspace?.id) {
        alert('Please select a workspace to generate a summary.')
        setIsGeneratingPDF(false)
        return
      }

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

      // Create PDF with dark theme
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      let yPosition = 15
      const margin = 15
      const cardPadding = 10
      const lineHeight = 6
      const maxWidth = pageWidth - 2 * margin

      // Dark theme colors
      const colors = {
        background: [26, 26, 26],      // Dark gray background
        cardBackground: [40, 40, 40],   // Slightly lighter for cards
        textPrimary: [255, 255, 255],   // White text
        textSecondary: [200, 200, 200], // Light gray text
        textMuted: [150, 150, 150],     // Muted gray text
        accentRed: [220, 53, 69],        // Red for important headings
        accentBlue: [102, 126, 234],     // Blue accent
        border: [60, 60, 60]             // Border color
      }

      // Set background color for first page
      doc.setFillColor(...colors.background)
      doc.rect(0, 0, pageWidth, pageHeight, 'F')

      // Helper function to check and add new page if needed
      const checkNewPage = (requiredSpace = lineHeight) => {
        if (yPosition + requiredSpace > pageHeight - margin) {
          doc.addPage()
          // Set background for new page
          doc.setFillColor(...colors.background)
          doc.rect(0, 0, pageWidth, pageHeight, 'F')
          yPosition = margin
        }
      }

      // Helper function to draw rounded rectangle (card)
      const drawCard = (x, y, width, height, radius = 5) => {
        doc.setFillColor(...colors.cardBackground)
        doc.setDrawColor(...colors.border)
        doc.setLineWidth(0.5)
        // Draw rounded rectangle (simplified)
        doc.roundedRect(x, y, width, height, radius, radius, 'FD')
      }

      // Helper function to add text with word wrap
      const addText = (text, fontSize = 12, isBold = false, color = colors.textPrimary, indent = 0, spacing = 3) => {
        doc.setFontSize(fontSize)
        doc.setTextColor(color[0], color[1], color[2])
        if (isBold) {
          doc.setFont(undefined, 'bold')
        } else {
          doc.setFont(undefined, 'normal')
        }

        const lines = doc.splitTextToSize(text, maxWidth - indent - cardPadding * 2)
        
        lines.forEach((line) => {
          checkNewPage(lineHeight)
          doc.text(line, margin + cardPadding + indent, yPosition)
          yPosition += lineHeight
        })

        yPosition += spacing // Add spacing after text
        return yPosition
      }

      // Helper function to add metric badge
      const addMetric = (label, value, x, y) => {
        const textSize = 9
        doc.setFontSize(textSize)
        doc.setTextColor(...colors.textSecondary)
        doc.setFont(undefined, 'normal')
        doc.text(label, x, y)
        doc.setFont(undefined, 'bold')
        doc.setTextColor(...colors.textPrimary)
        doc.text(value, x, y + 5)
      }

      // Parse and add markdown content
      const parseMarkdown = (markdownText) => {
        const lines = markdownText.split('\n')
        
        lines.forEach((line) => {
          const trimmedLine = line.trim()
          
          // Skip empty lines
          if (!trimmedLine) {
            yPosition += lineHeight / 2
            return
          }

          // Parse heading levels
          if (trimmedLine.startsWith('# ')) {
            // Main title (H1) - Red accent
            checkNewPage(20)
            addText(trimmedLine.substring(2), 24, true, colors.accentRed, 0, 10)
            // Add underline
            doc.setDrawColor(...colors.accentRed)
            doc.setLineWidth(1)
            checkNewPage(3)
            doc.line(margin + cardPadding, yPosition - 2, pageWidth - margin - cardPadding, yPosition - 2)
            yPosition += 5
          } else if (trimmedLine.startsWith('## ')) {
            // Section heading (H2) - Red accent
            checkNewPage(15)
            addText(trimmedLine.substring(3), 18, true, colors.accentRed, 0, 8)
            // Add underline
            doc.setDrawColor(...colors.accentRed)
            doc.setLineWidth(0.5)
            checkNewPage(2)
            doc.line(margin + cardPadding, yPosition - 2, pageWidth - margin - cardPadding, yPosition - 2)
            yPosition += 3
          } else if (trimmedLine.startsWith('### ')) {
            // Subsection heading (H3)
            checkNewPage(12)
            addText(trimmedLine.substring(4), 14, true, colors.textPrimary, 0, 6)
          } else if (trimmedLine.startsWith('#### ')) {
            // Sub-subsection heading (H4)
            checkNewPage(10)
            addText(trimmedLine.substring(5), 12, true, colors.textPrimary, 0, 5)
          } else if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
            // Bullet point
            const indent = line.startsWith('\t') ? 15 : 10
            const content = trimmedLine.substring(2).trim()
            // Draw bullet point
            doc.setFillColor(...colors.accentBlue)
            checkNewPage(3)
            doc.circle(margin + cardPadding + indent - 3, yPosition - 2, 1.5, 'F')
            addText(content, 11, false, colors.textSecondary, indent, 3)
          } else if (trimmedLine.startsWith('+ ')) {
            // Nested bullet point
            const content = trimmedLine.substring(2).trim()
            doc.setFillColor(...colors.accentBlue)
            checkNewPage(3)
            doc.circle(margin + cardPadding + 20, yPosition - 2, 1, 'F')
            addText(content, 10, false, colors.textMuted, 20, 2)
          } else if (trimmedLine.startsWith('\t')) {
            // Indented content (nested lists)
            const content = trimmedLine.substring(1).trim()
            addText(`  ${content}`, 10, false, colors.textMuted, 15, 2)
          } else {
            // Regular paragraph
            addText(trimmedLine, 11, false, colors.textSecondary, 0, 4)
          }
        })
      }

      // Calculate metrics
      const nodeCount = nodes.length
      const edgeCount = edges.length
      const generatedDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })

      // Draw main card for Strategic Brief
      const cardHeight = 60
      checkNewPage(cardHeight)
      drawCard(margin, yPosition, pageWidth - 2 * margin, cardHeight)
      
      // Title
      yPosition += 15
      addText('Strategic Brief: AI-Enhanced Analysis', 20, true, colors.textPrimary, 0, 0)
      
      // Metadata bar
      yPosition += 8
      const metricY = yPosition
      const metricSpacing = (pageWidth - 2 * margin - 2 * cardPadding) / 4
      addMetric('Generated', generatedDate, margin + cardPadding, metricY)
      addMetric('Nodes', nodeCount.toString(), margin + cardPadding + metricSpacing, metricY)
      addMetric('Connections', edgeCount.toString(), margin + cardPadding + metricSpacing * 2, metricY)
      
      // Confidence (could be calculated or from API)
      const confidence = summaryData?.confidence || 50
      addMetric('Confidence', `${confidence}%`, margin + cardPadding + metricSpacing * 3, metricY)
      
      yPosition += 20

      // Draw content card
      checkNewPage(30)
      const contentCardY = yPosition
      const contentCardHeight = pageHeight - yPosition - margin - 20
      drawCard(margin, contentCardY, pageWidth - 2 * margin, contentCardHeight)
      yPosition = contentCardY + cardPadding

      // Add summary content from API
      if (summaryData?.response) {
        parseMarkdown(summaryData.response)
      } else {
        addText('No summary content available.', 12, false, colors.textMuted, 0, 5)
      }

      // Save PDF
      const fileName = `StrategicBrief_${currentWorkspace?.name?.replace(/[^a-z0-9]/gi, '_') || 'Workspace'}_${new Date().toISOString().split('T')[0]}.pdf`
      doc.save(fileName)
      
      // Show success message
      alert('PDF generated successfully!')
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert(`Failed to generate PDF: ${error.message}`)
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
    </>
  )
}

export default Header

