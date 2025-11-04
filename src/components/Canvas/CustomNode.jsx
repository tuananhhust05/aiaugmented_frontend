import { Handle, Position } from 'reactflow'
import styled from 'styled-components'
import { X } from 'lucide-react'
import { useDecisionCanvasStore } from '../../store/useDecisionCanvasStore'

const NodeContainer = styled.div`
  background: #2a2a2a;
  border: 2px solid ${props => props.selected ? '#667eea' : '#3a3a3a'};
  border-radius: 8px;
  padding: 10px 12px;
  min-width: 180px;
  max-width: 280px;
  color: #ffffff;
  position: relative;
  cursor: move;
  transition: all 0.2s;
  margin: 0;
  box-sizing: border-box;

  &:hover {
    border-color: #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
`

const NodeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 6px;
`

const NodeLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  line-height: 1.4;
  flex: 1;
`

const NodeType = styled.div`
  font-size: 10px;
  color: #888888;
  margin-bottom: 4px;
`

const RemoveButton = styled.button`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #3a3a3a;
  border: none;
  border-radius: 4px;
  color: #ffffff;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s;
  position: absolute;
  top: 8px;
  right: 8px;

  ${NodeContainer}:hover & {
    opacity: 1;
  }

  &:hover {
    background: #f44336;
  }
`

const ViewDetailsButton = styled.div`
  font-size: 11px;
  color: #667eea;
  cursor: pointer;
  margin-top: 6px;
  text-decoration: underline;

  &:hover {
    color: #5568d3;
  }
`

function CustomNode({ data, selected, id }) {
  const { deleteNode, setSelectedNodeId } = useDecisionCanvasStore()

  const handleRemove = (e) => {
    e.stopPropagation()
    deleteNode(id)
  }

  const handleClick = () => {
    setSelectedNodeId(id)
  }

  return (
    <NodeContainer selected={selected} onClick={handleClick}>
      <Handle type="target" position={Position.Top} style={{ background: '#667eea' }} />
      
      <NodeHeader>
        <div style={{ flex: 1 }}>
          <NodeType>{data.type === 'user' ? 'User' : data.agent || 'AI'}</NodeType>
          <NodeLabel>{data.label}</NodeLabel>
        </div>
        <RemoveButton onClick={handleRemove} title="Remove">
          <X size={12} />
        </RemoveButton>
      </NodeHeader>
      
      {/* <ViewDetailsButton onClick={handleClick}>
        Click to view details
      </ViewDetailsButton> */}

      <Handle type="source" position={Position.Bottom} style={{ background: '#667eea' }} />
    </NodeContainer>
  )
}

export default CustomNode

