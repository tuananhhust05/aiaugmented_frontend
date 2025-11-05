import styled from 'styled-components'
import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Download, Palette, Type, Move, Settings, Sparkles, TrendingUp, Zap, FileText, Target, CheckCircle, Lightbulb, BarChart3, Users, Rocket } from 'lucide-react'
import jsPDF from 'jspdf'

const Container = styled.div`
  display: flex;
  height: 100vh;
  background: #0a0a0a;
`

const Sidebar = styled.div`
  width: 320px;
  background: #1a1a1a;
  border-right: 1px solid #2a2a2a;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`

const SidebarHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #2a2a2a;
  display: flex;
  align-items: center;
  gap: 12px;
`

const BackButton = styled.button`
  width: 32px;
  height: 32px;
  background: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: #333333;
    border-color: #4a4a4a;
  }
`

const SidebarTitle = styled.h2`
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`

const SidebarContent = styled.div`
  flex: 1;
  padding: 20px;
`

const Section = styled.div`
  margin-bottom: 24px;
`

const SectionTitle = styled.h3`
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`

const ControlGroup = styled.div`
  margin-bottom: 16px;
`

const Label = styled.label`
  display: block;
  color: #888888;
  font-size: 12px;
  margin-bottom: 6px;
`

const ColorInput = styled.input`
  width: 100%;
  height: 40px;
  background: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 6px;
  cursor: pointer;
`

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  background: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 6px;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  background: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 6px;
  color: #ffffff;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: #667eea;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background: #5568d3;
  }
`

const PreviewArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #0f0f0f;
  overflow: hidden;
`

const PreviewHeader = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid #2a2a2a;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const PreviewTitle = styled.h2`
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
`

const PreviewContainer = styled.div`
  flex: 1;
  overflow: auto;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`

const PDFPreview = styled.div`
  width: 210mm;
  min-height: 297mm;
  background: ${props => props.backgroundColor || '#1a1a1a'};
  padding: 20mm;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  position: relative;
`

const Block = styled.div`
  margin-bottom: ${props => props.marginBottom || 24}px;
  position: relative;
  cursor: ${props => props.draggable ? 'move' : 'default'};
  
  ${props => props.draggable && `
    &:hover {
      outline: 2px dashed #667eea;
      outline-offset: 4px;
    }
  `}
`

const Title = styled.h1`
  color: ${props => props.color || '#ffffff'};
  font-size: ${props => props.fontSize || 32}px;
  font-weight: ${props => props.fontWeight || 700};
  font-family: ${props => props.fontFamily || 'Arial, sans-serif'};
  margin: 0 0 16px 0;
  line-height: 1.2;
`

const SectionTitleStyled = styled.h2`
  color: ${props => props.color || '#ffffff'};
  font-size: ${props => props.fontSize || 24}px;
  font-weight: ${props => props.fontWeight || 600};
  font-family: ${props => props.fontFamily || 'Arial, sans-serif'};
  margin: 0 0 12px 0;
  line-height: 1.3;
`

const Text = styled.p`
  color: ${props => props.color || '#cccccc'};
  font-size: ${props => props.fontSize || 14}px;
  font-weight: ${props => props.fontWeight || 400};
  font-family: ${props => props.fontFamily || 'Arial, sans-serif'};
  line-height: 1.6;
  margin: 0 0 12px 0;
`

const BulletList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 16px 0;
`

const BulletItem = styled.li`
  color: ${props => props.color || '#cccccc'};
  font-size: ${props => props.fontSize || 14}px;
  font-weight: ${props => props.fontWeight || 400};
  font-family: ${props => props.fontFamily || 'Arial, sans-serif'};
  line-height: 1.6;
  margin-bottom: 8px;
  padding-left: 20px;
  position: relative;

  &:before {
    content: '•';
    position: absolute;
    left: 0;
    color: ${props => props.bulletColor || '#667eea'};
    font-weight: bold;
  }
`

// Modern Template Styles
const ModernHeader = styled.div`
  position: relative;
  padding-bottom: 24px;
  margin-bottom: 32px;
  border-bottom: 2px solid ${props => props.accentColor || '#667eea'};
`

const ModernIconWrapper = styled.div`
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, ${props => props.accentColor || '#667eea'} 0%, ${props => props.accentColor || '#764ba2'} 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 16px;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
`

const ModernSectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`

const ModernIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${props => props.accentColor || '#667eea'}15;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.accentColor || '#667eea'};
  flex-shrink: 0;
`

const ModernBullet = styled.li`
  color: ${props => props.color || '#4a5568'};
  font-size: ${props => props.fontSize || 15}px;
  font-family: ${props => props.fontFamily || '-apple-system, sans-serif'};
  line-height: 1.8;
  margin-bottom: 12px;
  padding-left: 32px;
  position: relative;
  list-style: none;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 10px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.bulletColor || '#667eea'};
    box-shadow: 0 0 0 4px ${props => props.bulletColor || '#667eea'}15;
  }
`

// Professional Template Styles
const ProfessionalSection = styled.div`
  border-left: 4px solid ${props => props.accentColor || '#e53e3e'};
  padding-left: 20px;
  margin-bottom: ${props => props.spacing || 28}px;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    left: -8px;
    top: 0;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${props => props.accentColor || '#e53e3e'};
    border: 3px solid ${props => props.bgColor || '#f8f9fa'};
  }
`

const ProfessionalBullet = styled.li`
  color: ${props => props.color || '#4a5568'};
  font-size: ${props => props.fontSize || 14}px;
  font-family: ${props => props.fontFamily || 'Times New Roman, serif'};
  line-height: 1.8;
  margin-bottom: 10px;
  padding-left: 24px;
  position: relative;
  list-style: none;

  &:before {
    content: '▸';
    position: absolute;
    left: 0;
    color: ${props => props.bulletColor || '#e53e3e'};
    font-weight: bold;
  }
`

// Creative Template Styles
const CreativeHeader = styled.div`
  background: linear-gradient(135deg, ${props => props.accentColor || '#4facfe'}20 0%, ${props => props.accentColor || '#00f2fe'}20 100%);
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 32px;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, ${props => props.accentColor || '#4facfe'}10 0%, transparent 70%);
    animation: rotate 20s linear infinite;
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`

const CreativeIconWrapper = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, ${props => props.accentColor || '#4facfe'} 0%, ${props => props.accentColor || '#00f2fe'} 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 20px;
  box-shadow: 0 12px 32px rgba(79, 172, 254, 0.4);
  position: relative;
  z-index: 1;
`

const CreativeSectionCard = styled.div`
  background: ${props => props.bgColor || '#1e293b'};
  border-radius: 16px;
  padding: 24px;
  margin-bottom: ${props => props.spacing || 30}px;
  border: 1px solid ${props => props.accentColor || '#4facfe'}30;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(180deg, ${props => props.accentColor || '#4facfe'} 0%, ${props => props.accentColor || '#00f2fe'} 100%);
  }
`

const CreativeBullet = styled.li`
  color: ${props => props.color || '#cbd5e1'};
  font-size: ${props => props.fontSize || 16}px;
  font-family: ${props => props.fontFamily || '-apple-system, sans-serif'};
  line-height: 1.8;
  margin-bottom: 14px;
  padding-left: 36px;
  position: relative;
  list-style: none;

  &:before {
    content: '✨';
    position: absolute;
    left: 0;
    font-size: 18px;
  }
`

function PDFEditor({ templateId, summaryData, workspaceId, workspaceName, onClose }) {
  // Default settings based on template
  const getDefaultSettings = () => {
    if (templateId === 'modern') {
      return {
        backgroundColor: '#ffffff',
        primaryColor: '#1a1a1a',
        secondaryColor: '#4a5568',
        accentColor: '#667eea',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        headingSize: 36,
        sectionSize: 24,
        bodySize: 15,
        fontWeight: 700,
        blockSpacing: 32,
      }
    } else if (templateId === 'professional') {
      return {
        backgroundColor: '#f8f9fa',
        primaryColor: '#2d3748',
        secondaryColor: '#4a5568',
        accentColor: '#e53e3e',
        fontFamily: '"Times New Roman", serif',
        headingSize: 32,
        sectionSize: 22,
        bodySize: 14,
        fontWeight: 600,
        blockSpacing: 28,
      }
    } else {
      return {
        backgroundColor: '#0f172a',
        primaryColor: '#ffffff',
        secondaryColor: '#cbd5e1',
        accentColor: '#4facfe',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        headingSize: 38,
        sectionSize: 26,
        bodySize: 16,
        fontWeight: 700,
        blockSpacing: 30,
      }
    }
  }

  const [settings, setSettings] = useState(getDefaultSettings())

  const [draggingBlock, setDraggingBlock] = useState(null)
  const previewRef = useRef(null)

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleExportPDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    let yPosition = 20
    const margin = 20
    const maxWidth = pageWidth - 2 * margin

    // Helper to convert hex to RGB
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ] : [255, 255, 255]
    }

    // Set background
    const bgColor = hexToRgb(settings.backgroundColor)
    doc.setFillColor(...bgColor)
    doc.rect(0, 0, pageWidth, pageHeight, 'F')

    // Helper to add text
    const addText = (text, fontSize, isBold, color, spacing = 6) => {
      doc.setFontSize(fontSize)
      doc.setTextColor(...hexToRgb(color))
      doc.setFont(undefined, isBold ? 'bold' : 'normal')
      
      const lines = doc.splitTextToSize(text, maxWidth)
      
      lines.forEach((line) => {
        if (yPosition + spacing > pageHeight - margin) {
          doc.addPage()
          doc.setFillColor(...bgColor)
          doc.rect(0, 0, pageWidth, pageHeight, 'F')
          yPosition = margin
        }
        doc.text(line, margin, yPosition)
        yPosition += spacing
      })
      
      yPosition += spacing / 2
    }

    // Title
    addText('Strategic Brief', settings.headingSize, true, settings.primaryColor, 10)
    yPosition += 5

    // Executive Summary
    if (summaryData.executive_summary) {
      addText('Executive Summary', settings.sectionSize, true, settings.primaryColor, 8)
      addText(summaryData.executive_summary, settings.bodySize, false, settings.secondaryColor)
      yPosition += 10
    }

    // Key Points
    if (summaryData.key_points && summaryData.key_points.length > 0) {
      addText('Key Points', settings.sectionSize, true, settings.primaryColor, 8)
      summaryData.key_points.forEach(point => {
        doc.setFillColor(...hexToRgb(settings.accentColor))
        doc.circle(margin + 5, yPosition - 2, 2, 'F')
        addText(point, settings.bodySize, false, settings.secondaryColor)
      })
      yPosition += 10
    }

    // Sections
    if (summaryData.sections && summaryData.sections.length > 0) {
      summaryData.sections.forEach(section => {
        addText(section.title, settings.sectionSize, true, settings.primaryColor, 8)
        if (section.content) {
          addText(section.content, settings.bodySize, false, settings.secondaryColor)
        }
        if (section.points && section.points.length > 0) {
          section.points.forEach(point => {
            doc.setFillColor(...hexToRgb(settings.accentColor))
            doc.circle(margin + 5, yPosition - 2, 2, 'F')
            addText(point, settings.bodySize, false, settings.secondaryColor)
          })
        }
        yPosition += 10
      })
    }

    // Conclusions
    if (summaryData.conclusions) {
      addText('Conclusions', settings.sectionSize, true, settings.primaryColor, 8)
      addText(summaryData.conclusions, settings.bodySize, false, settings.secondaryColor)
      yPosition += 10
    }

    // Recommendations
    if (summaryData.recommendations && summaryData.recommendations.length > 0) {
      addText('Recommendations', settings.sectionSize, true, settings.primaryColor, 8)
      summaryData.recommendations.forEach(rec => {
        doc.setFillColor(...hexToRgb(settings.accentColor))
        doc.circle(margin + 5, yPosition - 2, 2, 'F')
        addText(rec, settings.bodySize, false, settings.secondaryColor)
      })
    }

    // Save PDF
    const fileName = `StrategicBrief_${workspaceName?.replace(/[^a-z0-9]/gi, '_') || 'Workspace'}_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(fileName)
    
    alert('PDF exported successfully!')
  }

  const getSectionIcon = (title) => {
    const lower = title.toLowerCase()
    if (lower.includes('market')) return <BarChart3 size={20} />
    if (lower.includes('financial')) return <TrendingUp size={20} />
    if (lower.includes('organizational') || lower.includes('people')) return <Users size={20} />
    if (lower.includes('strategy')) return <Target size={20} />
    if (lower.includes('action') || lower.includes('recommendation')) return <Rocket size={20} />
    return <FileText size={20} />
  }

  const renderModernTemplate = () => {
    return (
      <PDFPreview backgroundColor={settings.backgroundColor} ref={previewRef}>
        <ModernHeader accentColor={settings.accentColor}>
          <ModernIconWrapper accentColor={settings.accentColor}>
            <Sparkles size={32} />
          </ModernIconWrapper>
          <Title
            color={settings.primaryColor}
            fontSize={settings.headingSize}
            fontWeight={settings.fontWeight}
            fontFamily={settings.fontFamily}
          >
            Strategic Brief
          </Title>
        </ModernHeader>

        {summaryData.executive_summary && (
          <Block marginBottom={settings.blockSpacing}>
            <ModernSectionHeader>
              <ModernIcon accentColor={settings.accentColor}>
                <FileText size={20} />
              </ModernIcon>
              <SectionTitleStyled
                color={settings.primaryColor}
                fontSize={settings.sectionSize}
                fontWeight={settings.fontWeight}
                fontFamily={settings.fontFamily}
              >
                Executive Summary
              </SectionTitleStyled>
            </ModernSectionHeader>
            <Text
              color={settings.secondaryColor}
              fontSize={settings.bodySize}
              fontFamily={settings.fontFamily}
            >
              {summaryData.executive_summary}
            </Text>
          </Block>
        )}

        {summaryData.key_points && summaryData.key_points.length > 0 && (
          <Block marginBottom={settings.blockSpacing}>
            <ModernSectionHeader>
              <ModernIcon accentColor={settings.accentColor}>
                <CheckCircle size={20} />
              </ModernIcon>
              <SectionTitleStyled
                color={settings.primaryColor}
                fontSize={settings.sectionSize}
                fontWeight={settings.fontWeight}
                fontFamily={settings.fontFamily}
              >
                Key Points
              </SectionTitleStyled>
            </ModernSectionHeader>
            <BulletList>
              {summaryData.key_points.map((point, index) => (
                <ModernBullet
                  key={index}
                  color={settings.secondaryColor}
                  fontSize={settings.bodySize}
                  fontFamily={settings.fontFamily}
                  bulletColor={settings.accentColor}
                >
                  {point}
                </ModernBullet>
              ))}
            </BulletList>
          </Block>
        )}

        {summaryData.sections && summaryData.sections.map((section, index) => (
          <Block key={index} marginBottom={settings.blockSpacing}>
            <ModernSectionHeader>
              <ModernIcon accentColor={settings.accentColor}>
                {getSectionIcon(section.title)}
              </ModernIcon>
              <SectionTitleStyled
                color={settings.primaryColor}
                fontSize={settings.sectionSize}
                fontWeight={settings.fontWeight}
                fontFamily={settings.fontFamily}
              >
                {section.title}
              </SectionTitleStyled>
            </ModernSectionHeader>
            {section.content && (
              <Text
                color={settings.secondaryColor}
                fontSize={settings.bodySize}
                fontFamily={settings.fontFamily}
              >
                {section.content}
              </Text>
            )}
            {section.points && section.points.length > 0 && (
              <BulletList>
                {section.points.map((point, pIndex) => (
                  <ModernBullet
                    key={pIndex}
                    color={settings.secondaryColor}
                    fontSize={settings.bodySize}
                    fontFamily={settings.fontFamily}
                    bulletColor={settings.accentColor}
                  >
                    {point}
                  </ModernBullet>
                ))}
              </BulletList>
            )}
          </Block>
        ))}

        {summaryData.conclusions && (
          <Block marginBottom={settings.blockSpacing}>
            <ModernSectionHeader>
              <ModernIcon accentColor={settings.accentColor}>
                <Lightbulb size={20} />
              </ModernIcon>
              <SectionTitleStyled
                color={settings.primaryColor}
                fontSize={settings.sectionSize}
                fontWeight={settings.fontWeight}
                fontFamily={settings.fontFamily}
              >
                Conclusions
              </SectionTitleStyled>
            </ModernSectionHeader>
            <Text
              color={settings.secondaryColor}
              fontSize={settings.bodySize}
              fontFamily={settings.fontFamily}
            >
              {summaryData.conclusions}
            </Text>
          </Block>
        )}

        {summaryData.recommendations && summaryData.recommendations.length > 0 && (
          <Block marginBottom={settings.blockSpacing}>
            <ModernSectionHeader>
              <ModernIcon accentColor={settings.accentColor}>
                <Rocket size={20} />
              </ModernIcon>
              <SectionTitleStyled
                color={settings.primaryColor}
                fontSize={settings.sectionSize}
                fontWeight={settings.fontWeight}
                fontFamily={settings.fontFamily}
              >
                Recommendations
              </SectionTitleStyled>
            </ModernSectionHeader>
            <BulletList>
              {summaryData.recommendations.map((rec, index) => (
                <ModernBullet
                  key={index}
                  color={settings.secondaryColor}
                  fontSize={settings.bodySize}
                  fontFamily={settings.fontFamily}
                  bulletColor={settings.accentColor}
                >
                  {rec}
                </ModernBullet>
              ))}
            </BulletList>
          </Block>
        )}
      </PDFPreview>
    )
  }

  const renderProfessionalTemplate = () => {
    return (
      <PDFPreview backgroundColor={settings.backgroundColor} ref={previewRef}>
        <Block marginBottom={settings.blockSpacing}>
          <Title
            color={settings.primaryColor}
            fontSize={settings.headingSize}
            fontWeight={settings.fontWeight}
            fontFamily={settings.fontFamily}
            style={{ textAlign: 'center', marginBottom: '32px' }}
          >
            Strategic Brief
          </Title>
        </Block>

        {summaryData.executive_summary && (
          <ProfessionalSection accentColor={settings.accentColor} bgColor={settings.backgroundColor} spacing={settings.blockSpacing}>
            <SectionTitleStyled
              color={settings.primaryColor}
              fontSize={settings.sectionSize}
              fontWeight={settings.fontWeight}
              fontFamily={settings.fontFamily}
            >
              Executive Summary
            </SectionTitleStyled>
            <Text
              color={settings.secondaryColor}
              fontSize={settings.bodySize}
              fontFamily={settings.fontFamily}
            >
              {summaryData.executive_summary}
            </Text>
          </ProfessionalSection>
        )}

        {summaryData.key_points && summaryData.key_points.length > 0 && (
          <ProfessionalSection accentColor={settings.accentColor} bgColor={settings.backgroundColor} spacing={settings.blockSpacing}>
            <SectionTitleStyled
              color={settings.primaryColor}
              fontSize={settings.sectionSize}
              fontWeight={settings.fontWeight}
              fontFamily={settings.fontFamily}
            >
              Key Points
            </SectionTitleStyled>
            <BulletList>
              {summaryData.key_points.map((point, index) => (
                <ProfessionalBullet
                  key={index}
                  color={settings.secondaryColor}
                  fontSize={settings.bodySize}
                  fontFamily={settings.fontFamily}
                  bulletColor={settings.accentColor}
                >
                  {point}
                </ProfessionalBullet>
              ))}
            </BulletList>
          </ProfessionalSection>
        )}

        {summaryData.sections && summaryData.sections.map((section, index) => (
          <ProfessionalSection key={index} accentColor={settings.accentColor} bgColor={settings.backgroundColor} spacing={settings.blockSpacing}>
            <SectionTitleStyled
              color={settings.primaryColor}
              fontSize={settings.sectionSize}
              fontWeight={settings.fontWeight}
              fontFamily={settings.fontFamily}
            >
              {section.title}
            </SectionTitleStyled>
            {section.content && (
              <Text
                color={settings.secondaryColor}
                fontSize={settings.bodySize}
                fontFamily={settings.fontFamily}
              >
                {section.content}
              </Text>
            )}
            {section.points && section.points.length > 0 && (
              <BulletList>
                {section.points.map((point, pIndex) => (
                  <ProfessionalBullet
                    key={pIndex}
                    color={settings.secondaryColor}
                    fontSize={settings.bodySize}
                    fontFamily={settings.fontFamily}
                    bulletColor={settings.accentColor}
                  >
                    {point}
                  </ProfessionalBullet>
                ))}
              </BulletList>
            )}
          </ProfessionalSection>
        ))}

        {summaryData.conclusions && (
          <ProfessionalSection accentColor={settings.accentColor} bgColor={settings.backgroundColor} spacing={settings.blockSpacing}>
            <SectionTitleStyled
              color={settings.primaryColor}
              fontSize={settings.sectionSize}
              fontWeight={settings.fontWeight}
              fontFamily={settings.fontFamily}
            >
              Conclusions
            </SectionTitleStyled>
            <Text
              color={settings.secondaryColor}
              fontSize={settings.bodySize}
              fontFamily={settings.fontFamily}
            >
              {summaryData.conclusions}
            </Text>
          </ProfessionalSection>
        )}

        {summaryData.recommendations && summaryData.recommendations.length > 0 && (
          <ProfessionalSection accentColor={settings.accentColor} bgColor={settings.backgroundColor} spacing={settings.blockSpacing}>
            <SectionTitleStyled
              color={settings.primaryColor}
              fontSize={settings.sectionSize}
              fontWeight={settings.fontWeight}
              fontFamily={settings.fontFamily}
            >
              Recommendations
            </SectionTitleStyled>
            <BulletList>
              {summaryData.recommendations.map((rec, index) => (
                <ProfessionalBullet
                  key={index}
                  color={settings.secondaryColor}
                  fontSize={settings.bodySize}
                  fontFamily={settings.fontFamily}
                  bulletColor={settings.accentColor}
                >
                  {rec}
                </ProfessionalBullet>
              ))}
            </BulletList>
          </ProfessionalSection>
        )}
      </PDFPreview>
    )
  }

  const renderCreativeTemplate = () => {
    return (
      <PDFPreview backgroundColor={settings.backgroundColor} ref={previewRef}>
        <CreativeHeader accentColor={settings.accentColor}>
          <CreativeIconWrapper accentColor={settings.accentColor}>
            <Zap size={40} />
          </CreativeIconWrapper>
          <Title
            color={settings.primaryColor}
            fontSize={settings.headingSize}
            fontWeight={settings.fontWeight}
            fontFamily={settings.fontFamily}
            style={{ position: 'relative', zIndex: 1 }}
          >
            Strategic Brief
          </Title>
        </CreativeHeader>

        {summaryData.executive_summary && (
          <CreativeSectionCard bgColor={settings.backgroundColor} accentColor={settings.accentColor} spacing={settings.blockSpacing}>
            <SectionTitleStyled
              color={settings.primaryColor}
              fontSize={settings.sectionSize}
              fontWeight={settings.fontWeight}
              fontFamily={settings.fontFamily}
            >
              Executive Summary
            </SectionTitleStyled>
            <Text
              color={settings.secondaryColor}
              fontSize={settings.bodySize}
              fontFamily={settings.fontFamily}
            >
              {summaryData.executive_summary}
            </Text>
          </CreativeSectionCard>
        )}

        {summaryData.key_points && summaryData.key_points.length > 0 && (
          <CreativeSectionCard bgColor={settings.backgroundColor} accentColor={settings.accentColor} spacing={settings.blockSpacing}>
            <SectionTitleStyled
              color={settings.primaryColor}
              fontSize={settings.sectionSize}
              fontWeight={settings.fontWeight}
              fontFamily={settings.fontFamily}
            >
              Key Points
            </SectionTitleStyled>
            <BulletList>
              {summaryData.key_points.map((point, index) => (
                <CreativeBullet
                  key={index}
                  color={settings.secondaryColor}
                  fontSize={settings.bodySize}
                  fontFamily={settings.fontFamily}
                >
                  {point}
                </CreativeBullet>
              ))}
            </BulletList>
          </CreativeSectionCard>
        )}

        {summaryData.sections && summaryData.sections.map((section, index) => (
          <CreativeSectionCard key={index} bgColor={settings.backgroundColor} accentColor={settings.accentColor} spacing={settings.blockSpacing}>
            <SectionTitleStyled
              color={settings.primaryColor}
              fontSize={settings.sectionSize}
              fontWeight={settings.fontWeight}
              fontFamily={settings.fontFamily}
            >
              {section.title}
            </SectionTitleStyled>
            {section.content && (
              <Text
                color={settings.secondaryColor}
                fontSize={settings.bodySize}
                fontFamily={settings.fontFamily}
              >
                {section.content}
              </Text>
            )}
            {section.points && section.points.length > 0 && (
              <BulletList>
                {section.points.map((point, pIndex) => (
                  <CreativeBullet
                    key={pIndex}
                    color={settings.secondaryColor}
                    fontSize={settings.bodySize}
                    fontFamily={settings.fontFamily}
                  >
                    {point}
                  </CreativeBullet>
                ))}
              </BulletList>
            )}
          </CreativeSectionCard>
        ))}

        {summaryData.conclusions && (
          <CreativeSectionCard bgColor={settings.backgroundColor} accentColor={settings.accentColor} spacing={settings.blockSpacing}>
            <SectionTitleStyled
              color={settings.primaryColor}
              fontSize={settings.sectionSize}
              fontWeight={settings.fontWeight}
              fontFamily={settings.fontFamily}
            >
              Conclusions
            </SectionTitleStyled>
            <Text
              color={settings.secondaryColor}
              fontSize={settings.bodySize}
              fontFamily={settings.fontFamily}
            >
              {summaryData.conclusions}
            </Text>
          </CreativeSectionCard>
        )}

        {summaryData.recommendations && summaryData.recommendations.length > 0 && (
          <CreativeSectionCard bgColor={settings.backgroundColor} accentColor={settings.accentColor} spacing={settings.blockSpacing}>
            <SectionTitleStyled
              color={settings.primaryColor}
              fontSize={settings.sectionSize}
              fontWeight={settings.fontWeight}
              fontFamily={settings.fontFamily}
            >
              Recommendations
            </SectionTitleStyled>
            <BulletList>
              {summaryData.recommendations.map((rec, index) => (
                <CreativeBullet
                  key={index}
                  color={settings.secondaryColor}
                  fontSize={settings.bodySize}
                  fontFamily={settings.fontFamily}
                >
                  {rec}
                </CreativeBullet>
              ))}
            </BulletList>
          </CreativeSectionCard>
        )}
      </PDFPreview>
    )
  }

  const renderPreview = () => {
    if (templateId === 'modern') {
      return renderModernTemplate()
    } else if (templateId === 'professional') {
      return renderProfessionalTemplate()
    } else {
      return renderCreativeTemplate()
    }
  }

  return (
    <Container>
      <Sidebar>
        <SidebarHeader>
          <BackButton onClick={onClose}>
            <ArrowLeft size={18} />
          </BackButton>
          <SidebarTitle>Edit PDF</SidebarTitle>
        </SidebarHeader>
        
        <SidebarContent>
          <Section>
            <SectionTitle>
              <Palette size={16} />
              Colors
            </SectionTitle>
            
            <ControlGroup>
              <Label>Background Color</Label>
              <ColorInput
                type="color"
                value={settings.backgroundColor}
                onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
              />
            </ControlGroup>

            <ControlGroup>
              <Label>Primary Text Color</Label>
              <ColorInput
                type="color"
                value={settings.primaryColor}
                onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
              />
            </ControlGroup>

            <ControlGroup>
              <Label>Secondary Text Color</Label>
              <ColorInput
                type="color"
                value={settings.secondaryColor}
                onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
              />
            </ControlGroup>

            <ControlGroup>
              <Label>Accent Color</Label>
              <ColorInput
                type="color"
                value={settings.accentColor}
                onChange={(e) => handleSettingChange('accentColor', e.target.value)}
              />
            </ControlGroup>
          </Section>

          <Section>
            <SectionTitle>
              <Type size={16} />
              Typography
            </SectionTitle>
            
            <ControlGroup>
              <Label>Font Family</Label>
              <Select
                value={settings.fontFamily}
                onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
              >
                <option value="Arial, sans-serif">Arial</option>
                <option value="'Times New Roman', serif">Times New Roman</option>
                <option value="'Courier New', monospace">Courier New</option>
                <option value="'Georgia', serif">Georgia</option>
                <option value="'Verdana', sans-serif">Verdana</option>
                <option value="'Helvetica', sans-serif">Helvetica</option>
              </Select>
            </ControlGroup>

            <ControlGroup>
              <Label>Heading Size (px)</Label>
              <Input
                type="number"
                min="12"
                max="72"
                value={settings.headingSize}
                onChange={(e) => handleSettingChange('headingSize', parseInt(e.target.value))}
              />
            </ControlGroup>

            <ControlGroup>
              <Label>Section Size (px)</Label>
              <Input
                type="number"
                min="12"
                max="48"
                value={settings.sectionSize}
                onChange={(e) => handleSettingChange('sectionSize', parseInt(e.target.value))}
              />
            </ControlGroup>

            <ControlGroup>
              <Label>Body Size (px)</Label>
              <Input
                type="number"
                min="8"
                max="24"
                value={settings.bodySize}
                onChange={(e) => handleSettingChange('bodySize', parseInt(e.target.value))}
              />
            </ControlGroup>

            <ControlGroup>
              <Label>Font Weight</Label>
              <Select
                value={settings.fontWeight}
                onChange={(e) => handleSettingChange('fontWeight', parseInt(e.target.value))}
              >
                <option value="400">Normal</option>
                <option value="500">Medium</option>
                <option value="600">Semi Bold</option>
                <option value="700">Bold</option>
                <option value="800">Extra Bold</option>
              </Select>
            </ControlGroup>
          </Section>

          <Section>
            <SectionTitle>
              <Settings size={16} />
              Spacing
            </SectionTitle>
            
            <ControlGroup>
              <Label>Block Spacing (px)</Label>
              <Input
                type="number"
                min="0"
                max="60"
                value={settings.blockSpacing}
                onChange={(e) => handleSettingChange('blockSpacing', parseInt(e.target.value))}
              />
            </ControlGroup>
          </Section>

          <Button onClick={handleExportPDF}>
            <Download size={18} />
            Export PDF
          </Button>
        </SidebarContent>
      </Sidebar>

      <PreviewArea>
        <PreviewHeader>
          <PreviewTitle>Preview</PreviewTitle>
        </PreviewHeader>
        <PreviewContainer>
          {renderPreview()}
        </PreviewContainer>
      </PreviewArea>
    </Container>
  )
}

export default PDFEditor

