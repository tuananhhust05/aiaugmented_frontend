import styled from 'styled-components'
import { useState } from 'react'
import { FileText, Layout, Palette, Check, Sparkles, TrendingUp, Zap } from 'lucide-react'

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`

const Modal = styled.div`
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  padding: 32px;
  max-width: 900px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
`

const Title = styled.h2`
  color: #ffffff;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  text-align: center;
`

const Subtitle = styled.p`
  color: #888888;
  font-size: 14px;
  text-align: center;
  margin-bottom: 32px;
`

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 24px;
`

const TemplateCard = styled.div`
  background: ${props => props.selected ? '#2a2a2a' : '#222222'};
  border: 2px solid ${props => props.selected ? '#667eea' : '#2a2a2a'};
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.gradient || 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'};
    opacity: ${props => props.selected ? 1 : 0};
    transition: opacity 0.3s;
  }

  &:hover {
    border-color: ${props => props.selected ? '#667eea' : '#3a3a3a'};
    background: #252525;
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    
    &:before {
      opacity: 1;
    }
  }
`

const TemplateIcon = styled.div`
  width: 64px;
  height: 64px;
  background: ${props => props.bgColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;

  &:after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);
    animation: shimmer 3s infinite;
  }

  @keyframes shimmer {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const PreviewArea = styled.div`
  width: 100%;
  height: 120px;
  background: ${props => props.bg || '#ffffff'};
  border-radius: 8px;
  margin-bottom: 16px;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.1);
`

const PreviewContent = styled.div`
  padding: 12px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const PreviewTitleBar = styled.div`
  height: 4px;
  background: ${props => props.gradient || 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'};
  border-radius: 2px;
`

const PreviewTitle = styled.div`
  font-size: 10px;
  font-weight: 700;
  color: ${props => props.color || '#000000'};
  margin-bottom: 4px;
`

const PreviewText = styled.div`
  font-size: 8px;
  color: ${props => props.color || '#666666'};
  line-height: 1.3;
`

const TemplateName = styled.h3`
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
`

const TemplateDescription = styled.p`
  color: #888888;
  font-size: 12px;
  line-height: 1.5;
`

const SelectedBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  background: #667eea;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`

const Button = styled.button`
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  ${props => props.primary ? `
    background: #667eea;
    color: white;
    &:hover {
      background: #5568d3;
    }
  ` : `
    background: #2a2a2a;
    color: #ffffff;
    border: 1px solid #3a3a3a;
    &:hover {
      background: #333333;
    }
  `}
`

const TemplatePreview = ({ templateId, gradient, bgColor, textColor }) => {
  if (templateId === 'modern') {
    return (
      <PreviewArea bg="#ffffff">
        <PreviewContent>
          <div>
            <PreviewTitleBar gradient={gradient} />
            <PreviewTitle color={textColor} style={{ marginTop: '8px' }}>STRATEGIC BRIEF</PreviewTitle>
            <PreviewText color={textColor}>Executive Summary with modern icons and clean design</PreviewText>
          </div>
          <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: gradient, opacity: 0.6 }} />
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: gradient, opacity: 0.4 }} />
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: gradient, opacity: 0.2 }} />
          </div>
        </PreviewContent>
      </PreviewArea>
    )
  }
  
  if (templateId === 'professional') {
    return (
      <PreviewArea bg="#f8f9fa">
        <PreviewContent>
          <div style={{ borderLeft: '3px solid', borderColor: gradient, paddingLeft: '8px' }}>
            <PreviewTitle color={textColor} style={{ fontSize: '9px', fontWeight: '600' }}>EXECUTIVE SUMMARY</PreviewTitle>
            <PreviewText color={textColor} style={{ marginTop: '4px' }}>Professional business format with structured layout</PreviewText>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px', fontSize: '7px', color: textColor, opacity: 0.6 }}>
            <div>• Key Points</div>
            <div>• Sections</div>
            <div>• Recommendations</div>
          </div>
        </PreviewContent>
      </PreviewArea>
    )
  }
  
  if (templateId === 'creative') {
    return (
      <PreviewArea bg="linear-gradient(135deg, #667eea15 0%, #764ba215 100%)">
        <PreviewContent>
          <div>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              background: gradient, 
              borderRadius: '8px', 
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>✨</div>
            <PreviewTitle color={textColor}>Creative Brief</PreviewTitle>
            <PreviewText color={textColor}>Dynamic layout with vibrant colors</PreviewText>
          </div>
        </PreviewContent>
      </PreviewArea>
    )
  }
  
  return null
}

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Apple-inspired minimalism with elegant icons and subtle gradients',
    icon: Sparkles,
    bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    previewBg: '#ffffff',
    previewTextColor: '#1a1a1a'
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Corporate elegance with structured sections and refined typography',
    icon: TrendingUp,
    bgColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    previewBg: '#f8f9fa',
    previewTextColor: '#2d3748'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold design with vibrant colors and dynamic visual elements',
    icon: Zap,
    bgColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    previewBg: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
    previewTextColor: '#1a1a1a'
  }
]

function TemplateSelector({ onClose, onSelectTemplate }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  const handleSelect = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate)
    }
  }

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Title>Choose PDF Template</Title>
        <Subtitle>Select a template to customize your summary report</Subtitle>
        
        <TemplateGrid>
          {templates.map((template) => {
            const Icon = template.icon
            return (
              <TemplateCard
                key={template.id}
                selected={selectedTemplate === template.id}
                onClick={() => setSelectedTemplate(template.id)}
                gradient={template.gradient}
              >
                {selectedTemplate === template.id && (
                  <SelectedBadge>
                    <Check size={16} />
                  </SelectedBadge>
                )}
                <TemplateIcon bgColor={template.bgColor}>
                  <Icon size={28} />
                </TemplateIcon>
                <TemplatePreview
                  templateId={template.id}
                  gradient={template.gradient}
                  bgColor={template.previewBg}
                  textColor={template.previewTextColor}
                />
                <TemplateName>{template.name}</TemplateName>
                <TemplateDescription>{template.description}</TemplateDescription>
              </TemplateCard>
            )
          })}
        </TemplateGrid>

        <ButtonGroup>
          <Button onClick={onClose}>Cancel</Button>
          <Button primary onClick={handleSelect} disabled={!selectedTemplate}>
            Continue
          </Button>
        </ButtonGroup>
      </Modal>
    </Overlay>
  )
}

export default TemplateSelector

