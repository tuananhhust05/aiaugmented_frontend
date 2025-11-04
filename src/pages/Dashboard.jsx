import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { Plus, Folder, Calendar, MoreVertical, Trash2, Edit } from 'lucide-react'
import PublicHeader from '../components/PublicHeader/PublicHeader'
import { getCookie } from '../utils/cookies'
import { decodeJWT, isTokenExpired } from '../utils/jwt'
import { useDecisionCanvasStore } from '../store/useDecisionCanvasStore'
import CreateWorkspaceModal from '../components/Dashboard/CreateWorkspaceModal'

const PageContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0a0a0a;
  position: relative;
`

const MainContent = styled.div`
  flex: 1;
  padding: 40px 60px;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
`

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
`

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #667eea;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #5568d3;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
`

const WorkspaceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
`

const WorkspaceCard = styled.div`
  background: #1a1a1a;
  border: 2px solid #2a2a2a;
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  min-height: 180px;
  display: flex;
  flex-direction: column;

  &:hover {
    border-color: #667eea;
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
  }
`

const WorkspaceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`

const WorkspaceIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
`

const WorkspaceName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 8px 0;
  flex: 1;
`

const WorkspaceMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #888888;
  margin-top: auto;
`

const MenuButton = styled.button`
  background: transparent;
  border: none;
  color: #888888;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background: #222222;
    color: #ffffff;
  }
`

const MenuDropdown = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  background: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 8px;
  padding: 8px;
  min-width: 120px;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`

const MenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
  text-align: left;
  transition: all 0.2s;

  &:hover {
    background: #333333;
  }

  &.danger {
    color: #f5576c;

    &:hover {
      background: #3a1a1a;
    }
  }
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
`

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #1a1a1a;
  border: 2px dashed #2a2a2a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  color: #666666;
`

const EmptyTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 12px 0;
`

const EmptyText = styled.p`
  font-size: 16px;
  color: #888888;
  margin: 0 0 32px 0;
  max-width: 400px;
`

function Dashboard() {
  const navigate = useNavigate()
  const { workspaces, setCurrentWorkspace, setWorkspaces } = useDecisionCanvasStore()
  const [openMenuId, setOpenMenuId] = useState(null)
  const [userEmail, setUserEmail] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Enable scrolling
    const originalBodyOverflow = document.body.style.overflow
    const originalRootHeight = document.getElementById('root')?.style.height
    
    document.body.style.overflow = 'auto'
    const root = document.getElementById('root')
    if (root) {
      root.style.height = 'auto'
      root.style.minHeight = '100vh'
    }

    // Check authentication
    const token = getCookie('access_token')
    if (!token || isTokenExpired(token)) {
      navigate('/auth/login')
      return
    }

    const decoded = decodeJWT(token)
    if (decoded && decoded.sub) {
      setUserEmail(decoded.sub)
    }

    // Fetch workspaces from API
    fetchWorkspaces()

    return () => {
      document.body.style.overflow = originalBodyOverflow
      if (root) {
        root.style.height = originalRootHeight || ''
        root.style.minHeight = ''
      }
    }
  }, [navigate])

  const fetchWorkspaces = async () => {
    const token = getCookie('access_token')
    if (!token || isTokenExpired(token)) {
      navigate('/auth/login')
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch('http://localhost:8000/workspaces', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/auth/login')
          return
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setWorkspaces(data || [])
    } catch (error) {
      console.error('Error fetching workspaces:', error)
      // Fallback to empty array
      setWorkspaces([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateWorkspace = async (workspaceName) => {
    const token = getCookie('access_token')
    if (!token || isTokenExpired(token)) {
      navigate('/auth/login')
      return
    }

    try {
      const response = await fetch('http://localhost:8000/workspaces', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: workspaceName
        })
      })

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/auth/login')
          return
        }
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || errorData.detail || `HTTP error! status: ${response.status}`)
      }

      const newWorkspace = await response.json()
      
      // Add to workspaces list
      const updatedWorkspaces = [...workspaces, newWorkspace]
      setWorkspaces(updatedWorkspaces)
      
      return newWorkspace
    } catch (error) {
      console.error('Error creating workspace:', error)
      throw error
    }
  }

  const handleWorkspaceClick = (workspace) => {
    setCurrentWorkspace(workspace)
    navigate(`/decision?workspace_id=${workspace.id}`)
  }

  const handleDeleteWorkspace = async (workspaceId, e) => {
    e.stopPropagation()
    if (!window.confirm('Are you sure you want to delete this workspace?')) {
      return
    }

    const token = getCookie('access_token')
    if (!token || isTokenExpired(token)) {
      navigate('/auth/login')
      return
    }

    try {
      const response = await fetch(`http://localhost:8000/workspaces/${workspaceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/auth/login')
          return
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Remove from workspaces list
      const updatedWorkspaces = workspaces.filter(w => w.id !== workspaceId)
      setWorkspaces(updatedWorkspaces)
      setOpenMenuId(null)
    } catch (error) {
      console.error('Error deleting workspace:', error)
      alert('Failed to delete workspace. Please try again.')
    }
  }

  const handleEditWorkspace = async (workspace, e) => {
    e.stopPropagation()
    const newName = prompt('Enter new workspace name:', workspace.name)
    if (!newName || !newName.trim()) {
      return
    }

    const token = getCookie('access_token')
    if (!token || isTokenExpired(token)) {
      navigate('/auth/login')
      return
    }

    try {
      const response = await fetch(`http://localhost:8000/workspaces/${workspace.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newName.trim()
        })
      })

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/auth/login')
          return
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const updatedWorkspace = await response.json()
      
      // Update in workspaces list
      const updatedWorkspaces = workspaces.map(w =>
        w.id === workspace.id ? updatedWorkspace : w
      )
      setWorkspaces(updatedWorkspaces)
      setOpenMenuId(null)
    } catch (error) {
      console.error('Error updating workspace:', error)
      alert('Failed to update workspace. Please try again.')
    }
  }

  return (
    <PageContainer>
      <PublicHeader />
      <MainContent>
        <HeaderSection>
          <Title>My Workspaces</Title>
          <CreateButton onClick={() => setShowCreateModal(true)}>
            <Plus size={20} />
            Create Workspace
          </CreateButton>
        </HeaderSection>

        {isLoading ? (
          <EmptyState>
            <EmptyTitle>Loading workspaces...</EmptyTitle>
          </EmptyState>
        ) : workspaces.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <Folder size={40} />
            </EmptyIcon>
            <EmptyTitle>No workspaces yet</EmptyTitle>
            <EmptyText>
              Create your first workspace to start organizing your strategic decisions
            </EmptyText>
            <CreateButton onClick={() => setShowCreateModal(true)}>
              <Plus size={20} />
              Create Your First Workspace
            </CreateButton>
          </EmptyState>
        ) : (
          <WorkspaceGrid>
            {workspaces.map((workspace) => (
              <WorkspaceCard
                key={workspace.id}
                onClick={() => handleWorkspaceClick(workspace)}
              >
                <WorkspaceHeader>
                  <div style={{ flex: 1 }}>
                    <WorkspaceIcon>
                      <Folder size={24} color="#ffffff" />
                    </WorkspaceIcon>
                    <WorkspaceName>{workspace.name}</WorkspaceName>
                  </div>
                  <MenuButton
                    onClick={(e) => {
                      e.stopPropagation()
                      setOpenMenuId(openMenuId === workspace.id ? null : workspace.id)
                    }}
                  >
                    <MoreVertical size={18} />
                  </MenuButton>
                </WorkspaceHeader>

                <WorkspaceMeta>
                  <Calendar size={14} />
                  <span>Workspace</span>
                </WorkspaceMeta>

                {openMenuId === workspace.id && (
                  <MenuDropdown onClick={(e) => e.stopPropagation()}>
                    <MenuItem onClick={(e) => handleEditWorkspace(workspace, e)}>
                      <Edit size={16} />
                      Edit
                    </MenuItem>
                    <MenuItem
                      className="danger"
                      onClick={(e) => handleDeleteWorkspace(workspace.id, e)}
                    >
                      <Trash2 size={16} />
                      Delete
                    </MenuItem>
                  </MenuDropdown>
                )}
              </WorkspaceCard>
            ))}
          </WorkspaceGrid>
        )}

        {showCreateModal && (
          <CreateWorkspaceModal
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateWorkspace}
          />
        )}
      </MainContent>
    </PageContainer>
  )
}

export default Dashboard

