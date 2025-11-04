import { useMemo } from 'react'
import styled from 'styled-components'
import PublicHeader from '../components/PublicHeader/PublicHeader'
import { Sparkles } from 'lucide-react'

const PageContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #ffffff;
`

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 32px;
  position: relative;
  overflow: hidden;
`

const NetworkGraph = styled.div`
  width: 100%;
  max-width: 1200px;
  height: 500px;
  position: relative;
  margin: 40px 0;
`

const GraphCanvas = styled.svg`
  width: 100%;
  height: 100%;
`

const ClusterLabel = styled.div`
  position: absolute;
  bottom: -40px;
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  text-transform: uppercase;
  letter-spacing: 2px;
`

const LeftLabel = styled(ClusterLabel)`
  left: 20%;
  transform: translateX(-50%);
`

const RightLabel = styled(ClusterLabel)`
  right: 20%;
  transform: translateX(50%);
`

const ChatWidget = styled.button`
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #4a90e2;
  border: none;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
  transition: all 0.3s;
  z-index: 1000;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(74, 144, 226, 0.5);
  }
`

// Function to generate network graph nodes and edges
const generateNetworkGraph = () => {
  const nodes = []
  const edges = []
  
  // Yellow cluster (Human Competence) - left side
  for (let i = 0; i < 30; i++) {
    const angle = (i / 30) * Math.PI * 2
    const radius = 60 + Math.random() * 50
    const x = 280 + Math.cos(angle) * radius + (Math.random() - 0.5) * 40
    const y = 250 + Math.sin(angle) * radius + (Math.random() - 0.5) * 40
    nodes.push({ id: `human-${i}`, x, y, color: '#f5d76e', cluster: 'human' })
  }
  
  // Blue cluster (AI Core Intelligence) - right side
  for (let i = 0; i < 30; i++) {
    const angle = (i / 30) * Math.PI * 2
    const radius = 60 + Math.random() * 50
    const x = 920 + Math.cos(angle) * radius + (Math.random() - 0.5) * 40
    const y = 250 + Math.sin(angle) * radius + (Math.random() - 0.5) * 40
    nodes.push({ id: `ai-${i}`, x, y, color: '#85c1e2', cluster: 'ai' })
  }
  
  // Connection nodes in the middle (intermingled)
  for (let i = 0; i < 20; i++) {
    const x = 580 + (Math.random() - 0.5) * 80
    const y = 220 + (Math.random() - 0.5) * 80
    const color = Math.random() > 0.5 ? '#f5d76e' : '#85c1e2'
    nodes.push({ id: `conn-${i}`, x, y, color, cluster: 'mixed' })
  }
  
  // Generate edges within clusters
  nodes.forEach((node, i) => {
    // Connect to nearby nodes in same cluster
    nodes.slice(i + 1).forEach((targetNode) => {
      if (node.cluster === targetNode.cluster || 
          (node.cluster === 'mixed' || targetNode.cluster === 'mixed')) {
        const distance = Math.sqrt(
          Math.pow(node.x - targetNode.x, 2) + 
          Math.pow(node.y - targetNode.y, 2)
        )
        if (distance < 100 && Math.random() > 0.7) {
          edges.push({
            source: node,
            target: targetNode,
            color: node.color
          })
        }
      }
    })
  })
  
  return { nodes, edges }
}

function Home() {
  const { nodes, edges } = useMemo(() => generateNetworkGraph(), [])
  
  return (
    <PageContainer>
      <PublicHeader />
      <MainContent>
        <NetworkGraph>
          <GraphCanvas viewBox="0 0 1200 500">
            {/* Render edges */}
            {edges.map((edge, i) => {
              const opacity = 0.25 + Math.random() * 0.25
              return (
                <line
                  key={`edge-${i}`}
                  x1={edge.source.x}
                  y1={edge.source.y}
                  x2={edge.target.x}
                  y2={edge.target.y}
                  stroke={edge.color}
                  strokeWidth="1.5"
                  opacity={opacity}
                />
              )
            })}
            
            {/* Render nodes */}
            {nodes.map((node) => (
              <circle
                key={node.id}
                cx={node.x}
                cy={node.y}
                r="5"
                fill={node.color}
                opacity={0.9}
              />
            ))}
          </GraphCanvas>
          <LeftLabel>Human Competence</LeftLabel>
          <RightLabel>AI Core Intelligence</RightLabel>
        </NetworkGraph>
      </MainContent>
      <ChatWidget title="Chat support">
        <Sparkles size={24} />
      </ChatWidget>
    </PageContainer>
  )
}

export default Home
