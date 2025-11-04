import { useState } from 'react'
import { X } from 'lucide-react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useDecisionCanvasStore } from '../../store/useDecisionCanvasStore'
import { getCookie } from '../../utils/cookies'
import { isTokenExpired } from '../../utils/jwt'
import './CreateNodeDialog.css'

function CreateNodeDialog({ onClose }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { agents, addNode, nodes, setNodes, currentWorkspace } = useDecisionCanvasStore()
  const [selectedAgentId, setSelectedAgentId] = useState(null)
  const [nodeName, setNodeName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Lọc các agent đã active (đã bật toggle)
  const activeAgents = agents.filter(agent => agent.active)
  const workspaceId = searchParams.get('workspace_id') || currentWorkspace?.id

  const handleCreate = async () => {
    if (!selectedAgentId) return

    const selectedAgent = activeAgents.find(a => a.id === selectedAgentId)
    if (!selectedAgent) return

    if (!workspaceId) {
      alert('No workspace selected. Please select a workspace first.')
      return
    }

    const token = getCookie('access_token')
    if (!token || isTokenExpired(token)) {
      navigate('/auth/login')
      return
    }

    setIsLoading(true)

    try {
      // Call API to create node
      const response = await fetch('http://54.79.147.183:8001/nodes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          workspace_id: workspaceId,
          name: nodeName.trim() || `${selectedAgent.name}: New Node`,
          model_id: selectedAgent.model_id
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

      const apiNode = await response.json()

      // Convert API node to ReactFlow node format
      const reactFlowNode = {
        id: apiNode.id,
        type: 'default',
        position: {
          x: 200,
          y: 200 + nodes.length * 250
        },
        data: {
          label: apiNode.name,
          content: `Node: ${apiNode.name}`,
          type: 'ai',
          agent: selectedAgent.name,
          agentId: selectedAgent.id,
          agentCode: selectedAgent.code,
          model_id: apiNode.model_id,
          model: selectedAgent.model,
          nodeId: apiNode.id,
          workspaceId: apiNode.workspace_id,
          userId: apiNode.user_id
        }
      }

      // Add to nodes list
      addNode(reactFlowNode)

      // Reset form
      setSelectedAgentId(null)
      setNodeName('')
      onClose()
    } catch (error) {
      console.error('Error creating node:', error)
      alert(error.message || 'Failed to create node. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedAgentId(null)
    setNodeName('')
    onClose()
  }

  return (
    <div className="create-node-overlay" onClick={handleClose}>
      <div className="create-node-container" onClick={(e) => e.stopPropagation()}>
        <div className="create-node-header">
          <h2 className="create-node-title">Create New Node</h2>
          <button className="create-node-close-btn" onClick={handleClose}>
            <X size={18} />
          </button>
        </div>

        <div className="create-node-content">
          {activeAgents.length === 0 ? (
            <div className="create-node-empty-state">
              No active agents available. Please activate an agent first.
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '20px' }}>
                <label className="create-node-label">Select Agent *</label>
                <div className="create-node-agent-list">
                  {activeAgents.map(agent => (
                    <button
                      key={agent.id}
                      className={`create-node-agent-option ${selectedAgentId === agent.id ? 'selected' : ''}`}
                      onClick={() => setSelectedAgentId(agent.id)}
                    >
                      <span className={`create-node-agent-name ${selectedAgentId === agent.id ? 'selected' : ''}`}>
                        {agent.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '0' }}>
                <label className="create-node-label">Node Name (Optional)</label>
                <input
                  type="text"
                  className="create-node-input"
                  placeholder="Enter node name..."
                  value={nodeName}
                  onChange={(e) => setNodeName(e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        <div className="create-node-footer">
          <button className="create-node-btn create-node-btn-cancel" onClick={handleClose}>
            Cancel
          </button>
          <button 
            className="create-node-btn create-node-btn-primary"
            onClick={handleCreate}
            disabled={!selectedAgentId || activeAgents.length === 0 || isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Node'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateNodeDialog
