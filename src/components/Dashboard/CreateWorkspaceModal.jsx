import { useState } from 'react'
import styled from 'styled-components'
import { X } from 'lucide-react'

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const ModalContainer = styled.div`
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  padding: 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #2a2a2a;
`

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
`

const CloseButton = styled.button`
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
    background: #2a2a2a;
    color: #ffffff;
  }
`

const ModalContent = styled.div`
  padding: 24px;
`

const FormGroup = styled.div`
  margin-bottom: 24px;
`

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 8px;
`

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: #0f0f0f;
  border: 2px solid ${props => props.error ? '#e74c3c' : '#2a2a2a'};
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.error ? '#e74c3c' : '#667eea'};
  }

  &::placeholder {
    color: #555555;
  }
`

const ErrorMessage = styled.div`
  font-size: 12px;
  color: #e74c3c;
  margin-top: 4px;
`

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #2a2a2a;
`

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
`

const CancelButton = styled(Button)`
  background: #2a2a2a;
  color: #ffffff;

  &:hover {
    background: #333333;
  }
`

const CreateButton = styled(Button)`
  background: #667eea;
  color: #ffffff;

  &:hover:not(:disabled) {
    background: #5568d3;
  }

  &:disabled {
    background: #3a3a3a;
    color: #666666;
    cursor: not-allowed;
  }
`

function CreateWorkspaceModal({ onClose, onCreate }) {
  const [workspaceName, setWorkspaceName] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!workspaceName.trim()) {
      setError('Workspace name is required')
      return
    }

    setIsLoading(true)
    try {
      await onCreate(workspaceName.trim())
      setWorkspaceName('')
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to create workspace')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setWorkspaceName('')
      setError('')
      onClose()
    }
  }

  return (
    <Overlay onClick={handleClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Create New Workspace</ModalTitle>
          <CloseButton onClick={handleClose} disabled={isLoading}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalContent>
            <FormGroup>
              <Label>Workspace Name</Label>
              <Input
                type="text"
                value={workspaceName}
                onChange={(e) => {
                  setWorkspaceName(e.target.value)
                  setError('')
                }}
                placeholder="Enter workspace name"
                error={!!error}
                disabled={isLoading}
                autoFocus
              />
              {error && <ErrorMessage>{error}</ErrorMessage>}
            </FormGroup>
          </ModalContent>

          <ModalFooter>
            <CancelButton type="button" onClick={handleClose} disabled={isLoading}>
              Cancel
            </CancelButton>
            <CreateButton type="submit" disabled={isLoading || !workspaceName.trim()}>
              {isLoading ? 'Creating...' : 'Create Workspace'}
            </CreateButton>
          </ModalFooter>
        </form>
      </ModalContainer>
    </Overlay>
  )
}

export default CreateWorkspaceModal

