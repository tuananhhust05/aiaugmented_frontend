import { create } from 'zustand'
import { getCookie } from '../utils/cookies'
import { isTokenExpired } from '../utils/jwt'

export const useDecisionCanvasStore = create((set, get) => ({
  // Workspace state
  currentWorkspace: {
    id: '1',
    name: 'Agentic Boardroom',
    isPremium: true
  },
  workspaces: [],
  
  // Canvas state
  nodes: [],
  edges: [],
  canvasBackground: '#1a1a1a',
  viewport: { x: 0, y: 0, zoom: 1 },
  
  // Chat state
  activeAgent: 'Market Compass',
  agents: [
    { 
      id: 'market-compass', 
      code: 'MC', 
      name: 'Market Compass', 
      model_id: '2',
      model: 'moonshotai/kimi-k2-instruct',
      description: 'Analyze market signals, trends, and competition',
      active: true, 
      available: true 
    },
    { 
      id: 'financial-guardian', 
      code: 'FG', 
      name: 'Financial Guardian', 
      model_id: '3',
      model: 'openai/gpt-oss-20b',
      description: 'Simulate cash flow, stress-test finances, logic & calculations',
      active: false, 
      available: true 
    },
    { 
      id: 'strategy-analyst', 
      code: 'SA', 
      name: 'Strategy Analyst', 
      model_id: '4',
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      description: 'Framework logic, blind spot, testing assumption',
      active: false, 
      available: true 
    },
    { 
      id: 'people-advisor', 
      code: 'PA', 
      name: 'People Advisor', 
      model_id: '5',
      model: 'llama-3.3-70b-versatile',
      description: 'Organizational psychology, human reactions, appropriate tone',
      active: false, 
      available: true 
    },
    { 
      id: 'action-architect', 
      code: 'AA', 
      name: 'Action Architect', 
      model_id: '6',
      model: 'llama-3.1-8b-instant',
      description: 'Execution, timeline, resource, risk realism',
      active: false, 
      available: true 
    }
  ],
  nodeConversations: {}, // { nodeId: [messages] }
  
  // UI state
  currentView: 'decision-canvas', // 'decision-canvas' | 'executive-report'
  selectedNodeId: null,
  
  // Actions
  setCurrentView: (view) => set({ currentView: view }),
  
  addNode: (node) => set((state) => ({
    nodes: [...state.nodes, node]
  })),
  
  updateNode: (nodeId, updates) => set((state) => ({
    nodes: state.nodes.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    )
  })),
  
  deleteNode: async (nodeId) => {
    const token = getCookie('access_token')
    if (!token || isTokenExpired(token)) {
      console.error('No valid token for deleting node')
      return
    }

    try {
      // Call API to delete node
      const response = await fetch(`http://localhost:8000/nodes/${nodeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          console.error('Unauthorized: Please login again')
          return
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Update state after successful deletion
      const state = get()
      const conversations = { ...state.nodeConversations }
      delete conversations[nodeId]
      
      // Update localStorage
      try {
        localStorage.setItem('nodeConversations', JSON.stringify(conversations))
      } catch (error) {
        console.error('Error updating localStorage:', error)
      }
      
      set({
        nodes: state.nodes.filter(node => node.id !== nodeId),
        edges: state.edges.filter(edge => 
          edge.source !== nodeId && edge.target !== nodeId
        ),
        nodeConversations: conversations,
        selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId
      })
    } catch (error) {
      console.error('Error deleting node:', error)
      alert('Failed to delete node. Please try again.')
      throw error
    }
  },
  
  addEdge: (edge) => set((state) => ({
    edges: [...state.edges, edge]
  })),
  
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  
  setCanvasBackground: (color) => set({ canvasBackground: color }),
  
  setViewport: (viewport) => set({ viewport }),
  
  toggleAgent: (agentId) => set((state) => ({
    agents: state.agents.map(agent =>
      agent.id === agentId ? { ...agent, active: !agent.active } : agent
    ),
    activeAgent: state.agents.find(a => a.id === agentId)?.name || state.activeAgent
  })),
  
  // Load conversations from localStorage on init
  loadConversations: () => {
    try {
      const stored = localStorage.getItem('nodeConversations')
      if (stored) {
        const conversations = JSON.parse(stored)
        set({ nodeConversations: conversations })
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
    }
  },
  
  // Save conversations to localStorage
  saveConversations: (conversations) => {
    try {
      localStorage.setItem('nodeConversations', JSON.stringify(conversations))
      set({ nodeConversations: conversations })
    } catch (error) {
      console.error('Error saving conversations:', error)
    }
  },
  
  // Get messages for a specific node
  getNodeMessages: (nodeId) => {
    const state = get()
    return state.nodeConversations[nodeId] || []
  },
  
  // Add message to a specific node's conversation
  addNodeMessage: (nodeId, message) => set((state) => {
    const conversations = { ...state.nodeConversations }
    if (!conversations[nodeId]) {
      conversations[nodeId] = []
    }
    conversations[nodeId] = [...conversations[nodeId], message]
    
    // Save to localStorage
    try {
      localStorage.setItem('nodeConversations', JSON.stringify(conversations))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
    
    return { nodeConversations: conversations }
  }),
  
  setSelectedNodeId: (nodeId) => set({ selectedNodeId: nodeId }),

  setWorkspaces: (workspaces) => set({ workspaces }),
  
  createWorkspace: (workspace) => set((state) => {
    const updatedWorkspaces = [...state.workspaces, workspace]
    // Save to localStorage
    try {
      localStorage.setItem('workspaces', JSON.stringify(updatedWorkspaces))
    } catch (error) {
      console.error('Error saving workspaces:', error)
    }
    return {
      workspaces: updatedWorkspaces,
      currentWorkspace: workspace
    }
  }),

  setCurrentWorkspace: (workspace) => {
    set({ currentWorkspace: workspace })
    // Save to localStorage
    try {
      localStorage.setItem('currentWorkspace', JSON.stringify(workspace))
    } catch (error) {
      console.error('Error saving current workspace:', error)
    }
  },

  // Load workspaces from localStorage
  loadWorkspaces: () => {
    try {
      const storedWorkspaces = localStorage.getItem('workspaces')
      const storedCurrent = localStorage.getItem('currentWorkspace')
      if (storedWorkspaces) {
        const workspaces = JSON.parse(storedWorkspaces)
        set({ workspaces })
      }
      if (storedCurrent) {
        const current = JSON.parse(storedCurrent)
        set({ currentWorkspace: current })
      }
    } catch (error) {
      console.error('Error loading workspaces:', error)
    }
  }
}))

