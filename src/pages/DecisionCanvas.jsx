import styled from 'styled-components'
import { useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ReactFlowProvider } from 'reactflow'
import Header from '../components/Header/Header'
import LeftSidebar from '../components/LeftSidebar/LeftSidebar'
import RightSidebar from '../components/RightSidebar/RightSidebar'
import DecisionCanvas from '../components/Canvas/DecisionCanvas'
import { useDecisionCanvasStore } from '../store/useDecisionCanvasStore'
import { getCookie } from '../utils/cookies'
import { isTokenExpired } from '../utils/jwt'

const PageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0a0a0a;
`

const MainContent = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`

const CanvasWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

function DecisionCanvasPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { 
    currentView, 
    loadConversations, 
    workspaces, 
    setCurrentWorkspace,
    setNodes,
    setEdges,
    agents
  } = useDecisionCanvasStore()
  const workspaceId = searchParams.get('workspace_id')

  const fetchNodes = useCallback(async (workspaceId) => {
    const token = getCookie('access_token')
    if (!token || isTokenExpired(token)) {
      return
    }

    try {
      const response = await fetch(`http://54.79.147.183:8001/nodes?workspace_id=${workspaceId}`, {
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

      const apiNodes = await response.json()
      
      // Convert API nodes to ReactFlow nodes format
      const reactFlowNodes = apiNodes.map((apiNode, index) => {
        // Find agent by model_id
        const agent = agents.find(a => a.model_id === apiNode.model_id) || agents[0]
        
        return {
          id: apiNode.id,
          type: 'default',
          position: {
            x: 200,
            y: 200 + index * 250
          },
          data: {
            label: apiNode.name || `${agent.name}: Node`,
            content: `Node: ${apiNode.name}`,
            type: 'ai',
            agent: agent.name,
            agentId: agent.id,
            agentCode: agent.code,
            model_id: apiNode.model_id,
            model: agent.model,
            nodeId: apiNode.id,
            workspaceId: apiNode.workspace_id,
            userId: apiNode.user_id
          }
        }
      })

      setNodes(reactFlowNodes)

      // Create edges between nodes (simple sequential connection)
      if (reactFlowNodes.length > 1) {
        const newEdges = []
        for (let i = 0; i < reactFlowNodes.length - 1; i++) {
          newEdges.push({
            id: `edge-${reactFlowNodes[i].id}-${reactFlowNodes[i + 1].id}`,
            source: reactFlowNodes[i].id,
            target: reactFlowNodes[i + 1].id,
            style: { stroke: '#667eea', strokeWidth: 2 },
            animated: true
          })
        }
        setEdges(newEdges)
      } else {
        setEdges([])
      }
    } catch (error) {
      console.error('Error fetching nodes:', error)
      // Set empty arrays on error
      setNodes([])
      setEdges([])
    }
  }, [agents, navigate, setNodes, setEdges])

  const fetchWorkspace = useCallback(async (id) => {
    const token = getCookie('access_token')
    if (!token || isTokenExpired(token)) {
      navigate('/auth/login')
      return
    }

    try {
      const response = await fetch(`http://54.79.147.183:8001/workspaces/${id}`, {
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
        if (response.status === 404) {
          console.warn('Workspace not found, redirecting to dashboard')
          navigate('/dashboard')
          return
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const workspace = await response.json()
      setCurrentWorkspace(workspace)
      
      // Add to workspaces list if not already there
      if (!workspaces.find(w => w.id === workspace.id)) {
        useDecisionCanvasStore.setState({ workspaces: [...workspaces, workspace] })
      }

      // Fetch nodes for this workspace
      fetchNodes(id)
    } catch (error) {
      console.error('Error fetching workspace:', error)
      navigate('/dashboard')
    }
  }, [navigate, workspaces, setCurrentWorkspace, fetchNodes])

  // Check authentication and load workspace
  useEffect(() => {
    const token = getCookie('access_token')
    if (!token || isTokenExpired(token)) {
      navigate('/auth/login')
      return
    }

    // Load conversations from localStorage on mount
    loadConversations()

    // Load workspace if workspace_id is provided
    if (workspaceId) {
      const workspace = workspaces.find(w => w.id === workspaceId)
      if (workspace) {
        setCurrentWorkspace(workspace)
        // Fetch nodes for this workspace
        fetchNodes(workspaceId)
      } else {
        // If workspace not found in local state, fetch from API
        fetchWorkspace(workspaceId)
      }
    }
  }, [workspaceId, workspaces, navigate, loadConversations, setCurrentWorkspace, fetchNodes, fetchWorkspace])

  return (
    <PageContainer>
      <Header />
      <MainContent>
        <LeftSidebar />
        <CanvasWrapper>
          {currentView === 'decision-canvas' ? (
            <ReactFlowProvider>
              <DecisionCanvas />
            </ReactFlowProvider>
          ) : (
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#888888',
              fontSize: '18px'
            }}>
              Executive Report View (Coming Soon)
            </div>
          )}
        </CanvasWrapper>
        <RightSidebar />
      </MainContent>
    </PageContainer>
  )
}

export default DecisionCanvasPage

