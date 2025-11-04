import styled from 'styled-components'
import { X, ExternalLink } from 'lucide-react'
import { useDecisionCanvasStore } from '../../store/useDecisionCanvasStore'

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const PopupContainer = styled.div`
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
`

const PopupHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #2a2a2a;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const PopupTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
`

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2a2a2a;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #3a3a3a;
  }
`

const PopupContent = styled.div`
  padding: 20px;
  overflow-y: auto;
  flex: 1;
`

const Section = styled.div`
  margin-bottom: 24px;
`

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const SectionContent = styled.div`
  font-size: 14px;
  color: #cccccc;
  line-height: 1.6;
  background: #0f0f0f;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #2a2a2a;
`

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

const ListItem = styled.li`
  padding: 8px 0;
  border-bottom: 1px solid #2a2a2a;

  &:last-child {
    border-bottom: none;
  }
`

const ViewFullButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #667eea;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 16px;

  &:hover {
    background: #5568d3;
  }
`

function NodeDetailsPopup({ nodeId, onClose }) {
  const { nodes } = useDecisionCanvasStore()
  const node = nodes.find(n => n.id === nodeId)

  if (!node) {
    onClose()
    return null
  }

  // Simulate AI-generated content
  const aiSummary = `This is an AI-generated summary of the node content: "${node.data.content}". The strategic analysis suggests key considerations and actionable insights.`
  
  const opportunities = [
    'Market expansion potential',
    'Strategic partnerships',
    'Technology innovation',
    'Resource optimization'
  ]

  const considerations = [
    'Risk assessment required',
    'Stakeholder alignment needed',
    'Timeline constraints',
    'Budget implications'
  ]

  return (
    <PopupOverlay onClick={onClose}>
      <PopupContainer onClick={(e) => e.stopPropagation()}>
        <PopupHeader>
          <PopupTitle>Node Details</PopupTitle>
          <CloseButton onClick={onClose}>
            <X size={18} />
          </CloseButton>
        </PopupHeader>
        
        <PopupContent>
          <Section>
            <SectionTitle>Content</SectionTitle>
            <SectionContent>{node.data.content || node.data.label}</SectionContent>
          </Section>

          <Section>
            <SectionTitle>AI Summary</SectionTitle>
            <SectionContent>{aiSummary}</SectionContent>
          </Section>

          <Section>
            <SectionTitle>Opportunities</SectionTitle>
            <SectionContent>
              <List>
                {opportunities.map((opp, index) => (
                  <ListItem key={index}>{opp}</ListItem>
                ))}
              </List>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Considerations</SectionTitle>
            <SectionContent>
              <List>
                {considerations.map((cons, index) => (
                  <ListItem key={index}>{cons}</ListItem>
                ))}
              </List>
            </SectionContent>
          </Section>

          <ViewFullButton>
            <ExternalLink size={16} />
            View Full Content
          </ViewFullButton>
        </PopupContent>
      </PopupContainer>
    </PopupOverlay>
  )
}

export default NodeDetailsPopup

