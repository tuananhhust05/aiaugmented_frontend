import styled from 'styled-components'
import { useDecisionCanvasStore } from '../../store/useDecisionCanvasStore'

const AgentListContainer = styled.div`
  margin-bottom: 24px;
`

const AgentItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: ${props => props.active ? '#1a1a2e' : '#1a1a1a'};
  border: 1px solid ${props => props.active ? '#667eea' : '#2a2a2a'};
  border-radius: 6px;
  margin-bottom: 8px;
  transition: all 0.2s;
`

const AgentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`

const ToggleSwitch = styled.button`
  width: 44px;
  height: 24px;
  background: ${props => props.active ? '#667eea' : '#3a3a3a'};
  border: none;
  border-radius: 12px;
  position: relative;
  cursor: ${props => props.available ? 'pointer' : 'not-allowed'};
  opacity: ${props => props.available ? 1 : 0.5};
  transition: all 0.2s;

  &::after {
    content: '';
    position: absolute;
    width: 18px;
    height: 18px;
    background: white;
    border-radius: 50%;
    top: 3px;
    left: ${props => props.active ? '23px' : '3px'};
    transition: all 0.2s;
  }
`

const AgentName = styled.span`
  font-size: 14px;
  color: ${props => props.active ? '#ffffff' : props.available ? '#cccccc' : '#666666'};
  font-weight: ${props => props.active ? '600' : '400'};
`

const AgentDescription = styled.div`
  font-size: 11px;
  color: #888888;
  margin-top: 4px;
  line-height: 1.4;
`

const ComingSoon = styled.span`
  font-size: 11px;
  color: #666666;
  font-style: italic;
`

const DetailsButton = styled.button`
  padding: 4px 8px;
  background: transparent;
  border: 1px solid #2a2a2a;
  border-radius: 4px;
  color: #888888;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #222222;
    border-color: #3a3a3a;
    color: #ffffff;
  }
`

function AgentList() {
  const { agents, toggleAgent } = useDecisionCanvasStore()

  return (
    <AgentListContainer>
      {agents.map(agent => (
        <AgentItem key={agent.id} active={agent.active}>
          <AgentInfo>
            <ToggleSwitch
              active={agent.active}
              available={true}
              onClick={() => toggleAgent(agent.id)}
            />
            <div style={{ flex: 1 }}>
              <AgentName active={agent.active} available={agent.available}>
                {agent.name}
              </AgentName>
              {agent.description && (
                <AgentDescription>{agent.description}</AgentDescription>
              )}
              {!agent.available && <ComingSoon> - Coming Soon</ComingSoon>}
            </div>
          </AgentInfo>
          <DetailsButton>Details</DetailsButton>
        </AgentItem>
      ))}
    </AgentListContainer>
  )
}

export default AgentList

