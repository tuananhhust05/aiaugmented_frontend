import styled from 'styled-components'
import WorkspaceManagement from './WorkspaceManagement'
import AgentList from './AgentList'
import { Home, LayoutDashboard } from 'lucide-react'

const SidebarContainer = styled.div`
  width: 320px;
  height: 100%;
  background: #0f0f0f;
  border-right: 1px solid #2a2a2a;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const AgentsSection = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  
  /* Hide scrollbar */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`

const AgentsTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #ffffff;
`

const BottomNavigation = styled.div`
  padding: 16px;
  border-top: 1px solid #2a2a2a;
  display: flex;
  gap: 8px;
`

const NavButton = styled.button`
  flex: 1;
  padding: 12px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;

  &:hover {
    background: #222222;
    border-color: #3a3a3a;
  }
`

function LeftSidebar() {
  return (
    <SidebarContainer>
      <AgentsSection>
        <AgentsTitle>Agents</AgentsTitle>
        <WorkspaceManagement />
        <AgentList />
      </AgentsSection>
      <BottomNavigation>
        <NavButton>
          <LayoutDashboard size={18} />
          Dashboard
        </NavButton>
        <NavButton>
          <Home size={18} />
          Home
        </NavButton>
      </BottomNavigation>
    </SidebarContainer>
  )
}

export default LeftSidebar

