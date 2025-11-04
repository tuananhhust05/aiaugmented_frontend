import styled from 'styled-components'
import { useState, useRef, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Send, Paperclip, Mic, FileText, X, Download } from 'lucide-react'
import { useDecisionCanvasStore } from '../../store/useDecisionCanvasStore'
import { getCookie } from '../../utils/cookies'
import { isTokenExpired } from '../../utils/jwt'
import ChatMessages from './ChatMessages'

const ChatSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0 16px;
  overflow: hidden;
  min-height: 0;
  height: 100%;
`

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 16px 0 12px 0;
  border-bottom: 1px solid #2a2a2a;
  flex-shrink: 0;
`

const ChatTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 0;
`

const HeaderButtons = styled.div`
  display: flex;
  gap: 8px;
`

const HeaderButton = styled.button`
  padding: 4px 8px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 4px;
  color: #ffffff;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #222222;
    border-color: #3a3a3a;
  }
`

const ActiveAgent = styled.div`
  font-size: 12px;
  color: #888888;
  margin-bottom: 16px;
  flex-shrink: 0;
`

const ChatInputContainer = styled.div`
  margin-top: auto;
  padding: 16px 0 16px 0;
  border-top: 1px solid #2a2a2a;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #0f0f0f;
`

const ChatInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`

const ChatInput = styled.textarea`
  flex: 1;
  min-height: 44px;
  max-height: 120px;
  padding: 12px 40px 12px 12px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  resize: none;
  outline: none;
  transition: all 0.2s;
  font-family: inherit;

  &:focus {
    border-color: #667eea;
    background: #222222;
  }

  &::placeholder {
    color: #555555;
  }
`

const InputIcon = styled.button`
  position: absolute;
  right: ${props => props.position === 'right' ? '12px' : props.position === 'left' ? '35px' : 'auto'};
  left: ${props => props.position === 'left' ? 'auto' : 'auto'};
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #888888;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 1;

  &:hover {
    color: #ffffff;
  }
`

const SendButton = styled.button`
  width: 100%;
  padding: 10px 16px;
  background: #667eea;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover {
    background: #5568d3;
  }

  &:disabled {
    background: #3a3a3a;
    cursor: not-allowed;
  }
`

const Disclaimer = styled.div`
  font-size: 11px;
  color: #666666;
  text-align: center;
  margin-top: 4px;
  padding: 0;
  line-height: 1.4;
`

const FilePreview = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  font-size: 12px;
  width: 100%;
`

const FileInfo = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #cccccc;
`

const FileRemoveButton = styled.button`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #888888;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #f44336;
  }
`

const HiddenInput = styled.input`
  display: none;
`

const GetOutputButton = styled.button`
  width: 100%;
  padding: 10px 16px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;

  &:hover {
    background: #222222;
    border-color: #3a3a3a;
  }
`

function ChatInterface() {
  const { 
    selectedNodeId, 
    nodes,
    edges,
    addNodeMessage,
    loadConversations,
    nodeConversations
  } = useDecisionCanvasStore()
  const [inputValue, setInputValue] = useState('')
  const [uploadedFile, setUploadedFile] = useState(null)
  const fileInputRef = useRef(null)
  const [currentMessages, setCurrentMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Get current node info
  const currentNode = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) : null
  const nodeAgent = currentNode?.data?.agent || 'AI Agent'

  // Fetch messages from API
  const fetchMessages = async (nodeId) => {
    const token = getCookie('access_token')
    if (!token || isTokenExpired(token)) {
      console.error('No valid token for fetching messages')
      // Fallback to localStorage
      const messages = nodeConversations[nodeId] || []
      setCurrentMessages(messages)
      return
    }

    try {
      const response = await fetch(`http://localhost:8000/messages?node_id=${nodeId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          console.error('Unauthorized: Please login again')
          // Fallback to localStorage
          const messages = nodeConversations[nodeId] || []
          setCurrentMessages(messages)
          return
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const apiMessages = await response.json()
      
      // Get node agent for AI messages
      const node = nodes.find(n => n.id === nodeId)
      const agent = node?.data?.agent || 'AI Agent'
      
      // Convert API messages to internal format
      const convertedMessages = apiMessages.map((apiMsg) => ({
        id: apiMsg.id,
        type: apiMsg.sender === 'You' ? 'user' : 'ai',
        content: apiMsg.content,
        timestamp: new Date(), // API might not have timestamp
        addedToMap: false,
        agent: apiMsg.sender === 'AI' ? agent : undefined
      }))

      setCurrentMessages(convertedMessages)
      
      // Also save to store for consistency
      const conversations = { ...nodeConversations }
      conversations[nodeId] = convertedMessages
      useDecisionCanvasStore.getState().saveConversations(conversations)
    } catch (error) {
      console.error('Error fetching messages:', error)
      // Fallback to localStorage
      const messages = nodeConversations[nodeId] || []
      setCurrentMessages(messages)
    }
  }

  // Load conversations from localStorage on mount
  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  // Fetch messages from API when node is selected
  useEffect(() => {
    if (selectedNodeId) {
      fetchMessages(selectedNodeId)
    } else {
      setCurrentMessages([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNodeId])

  // Find previous node (node connected to current node)
  const previousNodeId = selectedNodeId 
    ? edges.find(e => e.target === selectedNodeId)?.source 
    : null
  const previousNode = previousNodeId ? nodes.find(n => n.id === previousNodeId) : null
  const previousNodeMessages = previousNodeId ? (nodeConversations[previousNodeId] || []) : []

  // Get last AI message from previous node (output)
  const getOutputFromPreviousNode = () => {
    if (!previousNodeId || previousNodeMessages.length === 0) return

    // Find last AI message (output)
    const lastAIMessage = [...previousNodeMessages].reverse().find(m => m.type === 'ai')
    if (!lastAIMessage) {
      alert('No AI output found in previous node')
      return
    }

    const outputText = lastAIMessage.content || ''

    // Copy to clipboard
    navigator.clipboard.writeText(outputText).then(() => {
      // Optionally show a notification
      alert(`Output from ${previousNode?.data?.label || 'previous node'} copied to clipboard!`)
      // Also paste into input field
      setInputValue(outputText)
    }).catch(err => {
      console.error('Failed to copy:', err)
      // Fallback: set to input field
      setInputValue(outputText)
    })
  }

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      // Check if file is PDF or Word
      const isPDF = file.type === 'application/pdf'
      const isWord = file.type === 'application/msword' || 
                     file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      
      if (isPDF || isWord) {
        setUploadedFile(file)
        // In a real implementation, you would upload the file and process it with RAG
        console.log('File uploaded:', file.name, 'Type:', file.type)
      } else {
        alert('Please upload a PDF or Word document')
      }
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false,
    noClick: true
  })

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileRemove = () => {
    setUploadedFile(null)
  }

  const handleSend = async () => {
    if (!inputValue.trim() && !uploadedFile) return
    if (!selectedNodeId) return

    const token = getCookie('access_token')
    if (!token || isTokenExpired(token)) {
      alert('Please login to send messages')
      return
    }

    const messageToSend = inputValue.trim()
    const messageContent = uploadedFile 
      ? `[File: ${uploadedFile.name}] ${messageToSend || 'Analyze this document'}`
      : messageToSend

    setIsLoading(true)

    try {
      // 1. Send user message to API
      const userMessageResponse = await fetch('http://localhost:8000/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          node_id: selectedNodeId,
          sender: 'You',
          content: messageContent
        })
      })

      if (!userMessageResponse.ok) {
        if (userMessageResponse.status === 401) {
          alert('Unauthorized. Please login again.')
          return
        }
        throw new Error(`Failed to save user message: ${userMessageResponse.status}`)
      }

      const savedUserMessage = await userMessageResponse.json()
      
      // Convert to internal format
      const userMessage = {
        id: savedUserMessage.id,
        type: 'user',
        content: savedUserMessage.content,
        timestamp: new Date(),
        addedToMap: false,
        file: uploadedFile ? {
          name: uploadedFile.name,
          size: uploadedFile.size,
          type: uploadedFile.type
        } : null
      }

      // Add to local state immediately
      addNodeMessage(selectedNodeId, userMessage)
      setCurrentMessages(prev => [...prev, userMessage])
      setInputValue('')
      setUploadedFile(null)

      // 2. Get AI response from chat API
      const modelId = currentNode?.data?.model_id
      if (!modelId) {
        console.error('No model_id found for current node')
        const errorMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          agent: nodeAgent,
          content: `Error: No model_id found for this node. Please recreate the node.`,
          timestamp: new Date(),
          addedToMap: false,
          error: true
        }
        addNodeMessage(selectedNodeId, errorMessage)
        setCurrentMessages(prev => [...prev, errorMessage])
        setIsLoading(false)
        return
      }

      // Call chat API to get AI response
      const chatResponse = await fetch('http://localhost:8000/groq/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model_id: modelId,
          message: messageToSend || (uploadedFile ? `Analyze this document: ${uploadedFile.name}` : 'Hello')
        })
      })

      if (!chatResponse.ok) {
        throw new Error(`HTTP error! status: ${chatResponse.status}`)
      }

      const chatData = await chatResponse.json()
      const aiContent = chatData.response || chatData.message || chatData.content || `Response from ${nodeAgent}`

      // 3. Save AI response to API
      const aiMessageResponse = await fetch('http://localhost:8000/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          node_id: selectedNodeId,
          sender: 'AI',
          content: aiContent
        })
      })

      if (!aiMessageResponse.ok) {
        console.error('Failed to save AI message, but showing it anyway')
      }

      const savedAIMessage = await aiMessageResponse.json().catch(() => ({
        id: (Date.now() + 1).toString(),
        content: aiContent
      }))
      
      // Convert to internal format
      const aiMessage = {
        id: savedAIMessage.id,
        type: 'ai',
        agent: nodeAgent,
        content: savedAIMessage.content || aiContent,
        timestamp: new Date(),
        addedToMap: false
      }
      
      addNodeMessage(selectedNodeId, aiMessage)
      setCurrentMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      
      // Fallback: show error message
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        agent: nodeAgent,
        content: `Error: Unable to send message. Please check if the API server is running at http://localhost:8000. Error: ${error.message}`,
        timestamp: new Date(),
        addedToMap: false,
        error: true
      }
      
      addNodeMessage(selectedNodeId, errorMessage)
      setCurrentMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleAddToMap = (messageId) => {
    if (!selectedNodeId) return
    const message = currentMessages.find(m => m.id === messageId)
    if (!message) return

    const nodeId = `node-${Date.now()}-${currentNode?.data?.agentCode || 'GEN'}`
    const node = {
      id: nodeId,
      type: 'default',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        label: `${message.agent || 'User'}: ${message.content.substring(0, 50)}...`,
        content: message.content,
        type: message.type,
        agent: message.agent,
        nodeId: nodeId
      }
    }

    addNode(node)

    // Update message status
    const updatedMessages = currentMessages.map(m =>
      m.id === messageId ? { ...m, addedToMap: true } : m
    )
    setCurrentMessages(updatedMessages)
    
    // Update in store
    const conversations = useDecisionCanvasStore.getState().nodeConversations
    conversations[selectedNodeId] = updatedMessages
    useDecisionCanvasStore.getState().saveConversations(conversations)
  }

  const handleNewChat = () => {
    // Clear current node's conversation
    if (selectedNodeId) {
      const conversations = useDecisionCanvasStore.getState().nodeConversations
      conversations[selectedNodeId] = []
      useDecisionCanvasStore.getState().saveConversations(conversations)
      setCurrentMessages([])
    }
  }

  const handleClear = () => {
    if (selectedNodeId) {
      const conversations = useDecisionCanvasStore.getState().nodeConversations
      conversations[selectedNodeId] = []
      useDecisionCanvasStore.getState().saveConversations(conversations)
      setCurrentMessages([])
    }
  }

  return (
    <ChatSection>
      <ChatHeader>
        <ChatTitle>
          {currentNode ? `${currentNode.data.label}` : 'Select a node to chat'}
        </ChatTitle>
        {/* <HeaderButtons>
          <HeaderButton onClick={handleNewChat} disabled={!selectedNodeId}>Chat</HeaderButton>
          <HeaderButton onClick={handleClear} disabled={!selectedNodeId}>Clear</HeaderButton>
          <HeaderButton disabled={!selectedNodeId}>Refresh</HeaderButton>
        </HeaderButtons> */}
      </ChatHeader>

      {currentNode && (
        <ActiveAgent>Agent: {nodeAgent}</ActiveAgent>
      )}

      <ChatMessages 
        messages={currentMessages}
        onAddToMap={handleAddToMap}
      />

      {previousNodeId && previousNodeMessages.some(m => m.type === 'ai') && (
        <GetOutputButton onClick={getOutputFromPreviousNode}>
          <Download size={16} />
          Get output from previous node
        </GetOutputButton>
      )}

      <ChatInputContainer {...getRootProps()}>
        <HiddenInput {...getInputProps()} ref={fileInputRef} />
        {uploadedFile && (
          <FilePreview>
            <FileInfo>
              <FileText size={16} />
              <span>{uploadedFile.name}</span>
              <span style={{ color: '#666', fontSize: '11px' }}>
                ({(uploadedFile.size / 1024).toFixed(1)} KB)
              </span>
            </FileInfo>
            <FileRemoveButton onClick={handleFileRemove} title="Remove file">
              <X size={14} />
            </FileRemoveButton>
          </FilePreview>
        )}
        <ChatInputWrapper>
          <InputIcon position="left" title="Attach file" onClick={handleFileClick}>
            <Paperclip size={18} />
          </InputIcon>
          <ChatInput
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isDragActive ? "Drop file here..." : "Ask your strategic agents anything..."}
          />
          <InputIcon position="right" title="Voice input">
            <Mic size={18} />
          </InputIcon>
        </ChatInputWrapper>
          <SendButton onClick={handleSend} disabled={(!inputValue.trim() && !uploadedFile) || !selectedNodeId || isLoading}>
            <Send size={16} />
            {isLoading ? 'Sending...' : 'Send Message'}
          </SendButton>
        <Disclaimer>
          AI Agents can make mistakes. Please double-check responses.
        </Disclaimer>
      </ChatInputContainer>
    </ChatSection>
  )
}

export default ChatInterface

