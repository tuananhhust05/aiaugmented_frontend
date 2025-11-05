import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import PDFEditor from '../components/Summary/PDFEditor'

const PageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: #0a0a0a;
  display: flex;
  flex-direction: column;
`

function SummaryEditorPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [templateId, setTemplateId] = useState(null)
  const [summaryData, setSummaryData] = useState(null)
  const [workspaceId, setWorkspaceId] = useState(null)
  const [workspaceName, setWorkspaceName] = useState(null)

  useEffect(() => {
    if (location.state) {
      setTemplateId(location.state.templateId)
      setSummaryData(location.state.summaryData)
      setWorkspaceId(location.state.workspaceId)
      setWorkspaceName(location.state.workspaceName)
    } else {
      // If no state, redirect back
      navigate('/decision')
    }
  }, [location, navigate])

  if (!templateId || !summaryData) {
    return (
      <PageContainer>
        <div style={{ color: 'white', padding: '20px', textAlign: 'center' }}>
          Loading...
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PDFEditor
        templateId={templateId}
        summaryData={summaryData}
        workspaceId={workspaceId}
        workspaceName={workspaceName}
        onClose={() => navigate('/decision')}
      />
    </PageContainer>
  )
}

export default SummaryEditorPage


