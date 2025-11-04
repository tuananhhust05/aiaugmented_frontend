import styled from 'styled-components'
import ChatInterface from '../LeftSidebar/ChatInterface'

const SidebarContainer = styled.div`
  width: 400px;
  height: 100%;
  background: #0f0f0f;
  border-left: 1px solid #2a2a2a;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const ChatLabel = styled.div`
  padding: 16px 16px 0 16px;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
`

function RightSidebar() {
  return (
    <SidebarContainer>
      <ChatLabel>Chat</ChatLabel>
      <ChatInterface />
    </SidebarContainer>
  )
}

export default RightSidebar

