import styled from 'styled-components'
import { X } from 'lucide-react'

const PaletteOverlay = styled.div`
  position: absolute;
  top: 60px;
  right: 16px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 16px;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  min-width: 200px;
`

const PaletteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`

const PaletteTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
`

const CloseButton = styled.button`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #888888;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #ffffff;
  }
`

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
`

const ColorOption = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 6px;
  border: 2px solid ${props => props.selected ? '#667eea' : '#2a2a2a'};
  background: ${props => props.color};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
    border-color: #667eea;
  }
`

const CustomColorInput = styled.input`
  width: 100%;
  height: 40px;
  margin-top: 12px;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  cursor: pointer;
  background: transparent;
`

const colors = [
  '#1a1a1a', '#0a0a0a', '#2a2a2a', '#1a1a2e',
  '#1e1e2e', '#0f0f1e', '#1a1a3a', '#2a1a3a',
  '#1a3a2a', '#2a3a1a', '#3a2a1a', '#3a1a2a'
]

function CanvasPalette({ currentColor, onColorChange, onClose }) {
  return (
    <PaletteOverlay>
      <PaletteHeader>
        <PaletteTitle>Canvas Color</PaletteTitle>
        <CloseButton onClick={onClose}>
          <X size={16} />
        </CloseButton>
      </PaletteHeader>
      
      <ColorGrid>
        {colors.map((color) => (
          <ColorOption
            key={color}
            color={color}
            selected={currentColor === color}
            onClick={() => onColorChange(color)}
            title={color}
          />
        ))}
      </ColorGrid>
      
      <CustomColorInput
        type="color"
        value={currentColor}
        onChange={(e) => onColorChange(e.target.value)}
        title="Custom color"
      />
    </PaletteOverlay>
  )
}

export default CanvasPalette

