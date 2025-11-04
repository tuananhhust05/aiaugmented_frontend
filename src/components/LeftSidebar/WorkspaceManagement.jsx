import styled from 'styled-components'
import { useState } from 'react'
import { Search, Plus, History, FolderOpen } from 'lucide-react'
import { useDecisionCanvasStore } from '../../store/useDecisionCanvasStore'
import CreateNodeDialog from './CreateNodeDialog'

const WorkspaceSection = styled.div`
  margin-bottom: 24px;
`

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #888888;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const WorkspaceActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;

  &:hover {
    background: #222222;
    border-color: #3a3a3a;
  }
`

const SearchInput = styled.div`
  position: relative;
  margin-bottom: 8px;
`

const SearchIcon = styled(Search)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #888888;
  width: 16px;
  height: 16px;
`

const Input = styled.input`
  width: 100%;
  padding: 10px 12px 10px 36px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  color: #ffffff;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: #667eea;
    background: #222222;
  }

  &::placeholder {
    color: #555555;
  }
`

function WorkspaceManagement() {
  const { currentWorkspace } = useDecisionCanvasStore()
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  return (
    <>
      <WorkspaceSection>
        <SectionTitle>Workspace</SectionTitle>
        
        <WorkspaceActions>
          <ActionButton onClick={() => setShowCreateDialog(true)}>
            <Plus size={18} />
            Create New Node
          </ActionButton>
         
        </WorkspaceActions>
      </WorkspaceSection>
      {showCreateDialog && (
        <CreateNodeDialog onClose={() => setShowCreateDialog(false)} />
      )}
    </>
  )
}

export default WorkspaceManagement

