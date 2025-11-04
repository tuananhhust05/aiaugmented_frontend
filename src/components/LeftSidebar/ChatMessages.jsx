import styled from 'styled-components'
import { Check, Plus, ThumbsUp, ThumbsDown } from 'lucide-react'
import { useState } from 'react'

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 0;
  padding-right: 8px;
  padding-bottom: 16px;
  min-height: 0;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #1a1a1a;
  }

  &::-webkit-scrollbar-thumb {
    background: #3a3a3a;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #4a4a4a;
  }
`

const Message = styled.div`
  margin-bottom: 16px;
  padding: 12px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
`

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`

const MessageSender = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.type === 'user' ? '#667eea' : '#f5576c'};
`

const MessageActions = styled.div`
  display: flex;
  gap: 4px;
`

const ActionButton = styled.button`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid #2a2a2a;
  border-radius: 4px;
  color: #888888;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #222222;
    border-color: #3a3a3a;
    color: #ffffff;
  }

  &.active {
    background: ${props => props.variant === 'up' ? '#4caf50' : '#f44336'};
    border-color: ${props => props.variant === 'up' ? '#4caf50' : '#f44336'};
    color: white;
  }
`

const MessageContent = styled.div`
  font-size: 14px;
  color: #cccccc;
  line-height: 1.6;
  margin-bottom: 8px;
`

const MessageFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #2a2a2a;
`

const AddToMapButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: ${props => props.added ? '#4caf50' : '#667eea'};
  border: none;
  border-radius: 4px;
  color: #ffffff;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.added ? '#45a049' : '#5568d3'};
  }

  &:disabled {
    background: #3a3a3a;
    cursor: not-allowed;
  }
`

const AddedStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #4caf50;
`

const FeedbackPopup = styled.div`
  position: absolute;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 16px;
  z-index: 1000;
  min-width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`

const FeedbackTextarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 8px;
  background: #0f0f0f;
  border: 1px solid #2a2a2a;
  border-radius: 4px;
  color: #ffffff;
  font-size: 12px;
  resize: vertical;
  margin-bottom: 12px;
  outline: none;

  &:focus {
    border-color: #667eea;
  }
`

const FeedbackActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`

const FeedbackButton = styled.button`
  padding: 6px 12px;
  background: ${props => props.primary ? '#667eea' : '#2a2a2a'};
  border: 1px solid ${props => props.primary ? '#667eea' : '#2a2a2a'};
  border-radius: 4px;
  color: #ffffff;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.primary ? '#5568d3' : '#3a3a3a'};
  }
`

function ChatMessages({ messages, onAddToMap }) {
  const [feedbackPopup, setFeedbackPopup] = useState(null)
  const [feedbackText, setFeedbackText] = useState('')
  const [feedbackType, setFeedbackType] = useState(null)

  const handleFeedback = (messageId, type) => {
    setFeedbackPopup(messageId)
    setFeedbackType(type)
  }

  const handleSubmitFeedback = () => {
    // Handle feedback submission
    console.log('Feedback submitted:', { messageId: feedbackPopup, type: feedbackType, text: feedbackText })
    setFeedbackPopup(null)
    setFeedbackText('')
    setFeedbackType(null)
  }

  return (
    <MessagesContainer>
      {messages.map(message => (
        <Message key={message.id}>
          <MessageHeader>
            <MessageSender type={message.type}>
              {message.type === 'user' ? 'You' : message.agent || 'AI Agent'}
            </MessageSender>
            <MessageActions>
              <ActionButton
                variant="up"
                onClick={() => handleFeedback(message.id, 'up')}
                title="Thumbs up"
              >
                <ThumbsUp size={14} />
              </ActionButton>
              <ActionButton
                variant="down"
                onClick={() => handleFeedback(message.id, 'down')}
                title="Thumbs down"
              >
                <ThumbsDown size={14} />
              </ActionButton>
            </MessageActions>
          </MessageHeader>
          <MessageContent>{message.content}</MessageContent>
          <MessageFooter>
            {message.type === 'user' && (
              message.addedToMap ? (
                // <AddedStatus>
                //   <Check size={14} />
                //   Added to Map
                // </AddedStatus>
                <>
                </>
              ) : (
                <></>
                // <AddToMapButton
                //   onClick={() => onAddToMap(message.id)}
                //   added={false}
                // >
                //   <Plus size={12} />
                //   Add to Map
                // </AddToMapButton>
              )
            )}
          </MessageFooter>
          {feedbackPopup === message.id && (
            <FeedbackPopup>
              <div style={{ marginBottom: '8px', fontSize: '12px', color: '#888' }}>
                {feedbackType === 'up' ? '👍' : '👎'} Provide detailed feedback:
              </div>
              <FeedbackTextarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="What did you like or dislike about this response?"
              />
              <FeedbackActions>
                <FeedbackButton onClick={() => setFeedbackPopup(null)}>
                  Cancel
                </FeedbackButton>
                <FeedbackButton primary onClick={handleSubmitFeedback}>
                  Submit
                </FeedbackButton>
              </FeedbackActions>
            </FeedbackPopup>
          )}
        </Message>
      ))}
    </MessagesContainer>
  )
}

export default ChatMessages

