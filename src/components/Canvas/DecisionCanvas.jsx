import { useCallback, useEffect, useState, useRef } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  Panel
} from 'reactflow'
import 'reactflow/dist/style.css'
import styled from 'styled-components'
import { ZoomIn, ZoomOut, RotateCcw, Trash2, Palette } from 'lucide-react'
import { useDecisionCanvasStore } from '../../store/useDecisionCanvasStore'
import CustomNode from './CustomNode'
import CanvasPalette from './CanvasPalette'

const CanvasContainer = styled.div`
  flex: 1;
  height: 100%;
  background: ${props => props.backgroundColor || '#1a1a1a'};
  position: relative;
`

const CanvasControls = styled(Panel)`
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 8px;
  z-index: 10;
`

const ControlButton = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #222222;
    border-color: #3a3a3a;
  }
`

const nodeTypes = {
  default: CustomNode
}

function DecisionCanvas() {
  const {
    nodes: storeNodes,
    edges: storeEdges,
    canvasBackground,
    setNodes,
    setEdges,
    setCanvasBackground,
    setViewport,
    deleteNode,
    selectedNodeId,
    setSelectedNodeId
  } = useDecisionCanvasStore()

  const [nodes, setNodesState, onNodesChange] = useNodesState(storeNodes)
  const [edges, setEdgesState, onEdgesChange] = useEdgesState(storeEdges)
  const [showPalette, setShowPalette] = useState(false)
  const reactFlowInstance = useRef(null)

  // Sync store with local state
  useEffect(() => {
    setNodesState(storeNodes)
  }, [storeNodes, setNodesState])

  useEffect(() => {
    setEdgesState(storeEdges)
  }, [storeEdges, setEdgesState])

  // Update store when nodes/edges change
  const handleNodesChange = useCallback((changes) => {
    onNodesChange(changes)
    const updatedNodes = nodes.map(node => {
      const change = changes.find(c => c.id === node.id)
      if (change) {
        if (change.type === 'position' && change.position) {
          return { ...node, position: change.position }
        }
        if (change.type === 'dimensions' && change.dimensions) {
          return { ...node, ...change.dimensions }
        }
      }
      return node
    })
    setNodes(updatedNodes)
  }, [nodes, onNodesChange, setNodes])

  const handleEdgesChange = useCallback((changes) => {
    onEdgesChange(changes)
    const updatedEdges = edges.map(edge => {
      const change = changes.find(c => c.id === edge.id)
      if (change) {
        return { ...edge, ...change }
      }
      return edge
    })
    setEdges(updatedEdges)
  }, [edges, onEdgesChange, setEdges])

  const onConnect = useCallback(
    (params) => {
      const newEdge = {
        ...params,
        id: `edge-${Date.now()}`,
        style: { stroke: '#667eea', strokeWidth: 2 },
        animated: true
      }
      setEdgesState((eds) => addEdge(newEdge, eds))
      setEdges([...edges, newEdge])
    },
    [edges, setEdges, setEdgesState]
  )

  const handleZoomIn = () => {
    if (reactFlowInstance.current) {
      reactFlowInstance.current.zoomIn()
    }
  }

  const handleZoomOut = () => {
    if (reactFlowInstance.current) {
      reactFlowInstance.current.zoomOut()
    }
  }

  const handleResetView = () => {
    if (reactFlowInstance.current) {
      reactFlowInstance.current.fitView({ padding: 0.2 })
    }
  }

  const onInit = (reactFlowInstanceRef) => {
    reactFlowInstance.current = reactFlowInstanceRef
  }

  const handleDeleteAll = () => {
    setNodes([])
    setEdges([])
    setNodesState([])
    setEdgesState([])
  }

  const handleNodeClick = (event, node) => {
    setSelectedNodeId(node.id)
  }

  const handlePaneClick = () => {
    setSelectedNodeId(null)
  }

  return (
    <CanvasContainer backgroundColor={canvasBackground}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        onInit={onInit}
        nodeTypes={nodeTypes}
        fitView
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        connectionLineStyle={{ stroke: '#667eea', strokeWidth: 2 }}
        connectionLineType="smoothstep"
        snapToGrid={true}
        snapGrid={[20, 20]}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#2a2a2a" />
        <MiniMap
          nodeColor="#667eea"
          nodeStrokeWidth={2}
          style={{ backgroundColor: '#0f0f0f', border: '1px solid #2a2a2a' }}
        />
        <Controls
          style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
          showInteractive={false}
        />
        <CanvasControls position="top-right">
          <ControlButton title="Zoom In" onClick={handleZoomIn}>
            <ZoomIn size={18} />
          </ControlButton>
          <ControlButton title="Zoom Out" onClick={handleZoomOut}>
            <ZoomOut size={18} />
          </ControlButton>
          <ControlButton title="Reset View" onClick={handleResetView}>
            <RotateCcw size={18} />
          </ControlButton>
          <ControlButton title="Delete All" onClick={handleDeleteAll}>
            <Trash2 size={18} />
          </ControlButton>
          <ControlButton title="Canvas Palette" onClick={() => setShowPalette(!showPalette)}>
            <Palette size={18} />
          </ControlButton>
        </CanvasControls>
      </ReactFlow>
      {showPalette && (
        <CanvasPalette
          currentColor={canvasBackground}
          onColorChange={setCanvasBackground}
          onClose={() => setShowPalette(false)}
        />
      )}
    </CanvasContainer>
  )
}

export default DecisionCanvas

