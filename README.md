# Agentic Boardroom - Decision Canvas

AI-powered strategic planning platform with Decision Canvas feature.

## Features

### 🗺️ Decision Canvas (Trang làm việc chính)

#### A. Left Sidebar
- **Workspace Management**: Create new workspaces, view history, search
- **Chat Interface**:
  - Orchestrated AI: 1 superagent coordinating 5 sub-agents
  - "Add to Map" functionality to add nodes to canvas
  - "Added to Map" status indicator
  - File upload (PDF, Word) for AI analysis (RAG)
  - Feedback system (👍👎) with detailed feedback popup
  - "New Chat" to open new threads
  - Voice-to-text support (stretch goal)
  - Image-to-text support (stretch goal)

#### B. Center Canvas
- **Node System**: Create, drag & drop, connect nodes
- **AI Summary Popup**: View detailed content with AI Summary, Opportunities, and Considerations
- **Connector System**: Draw logical connections between nodes
- **Canvas Controls**: Drag, zoom in/out, reset view, delete nodes
- **Canvas Palette**: Change background color

#### C. Header Navigation
- Toggle between Decision Canvas and Executive Report
- Display workspace name, account menu, home button

## Tech Stack

- **React 18** with Vite
- **React Router** for routing
- **ReactFlow** for canvas/node system
- **Styled Components** for styling
- **Zustand** for state management
- **React Dropzone** for file uploads
- **Lucide React** for icons

## Getting Started

### Prerequisites
- Node.js 22+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development

The app will be available at `http://54.79.147.183:3000`

## Project Structure

```
src/
├── components/
│   ├── Header/
│   │   └── Header.jsx
│   ├── LeftSidebar/
│   │   ├── LeftSidebar.jsx
│   │   ├── WorkspaceManagement.jsx
│   │   ├── ChatInterface.jsx
│   │   ├── AgentList.jsx
│   │   └── ChatMessages.jsx
│   └── Canvas/
│       ├── DecisionCanvas.jsx
│       ├── CustomNode.jsx
│       ├── NodeDetailsPopup.jsx
│       └── CanvasPalette.jsx
├── pages/
│   └── DecisionCanvas.jsx
├── store/
│   └── useDecisionCanvasStore.js
├── App.jsx
├── main.jsx
└── index.css
```

## Features in Detail

### Chat Interface
- Real-time chat with AI agents
- File upload support (PDF, Word)
- Drag & drop file upload
- Message feedback system
- Add messages to canvas as nodes

### Canvas System
- Interactive node system with drag & drop
- Connect nodes with edges
- Zoom, pan, and reset view
- Customizable canvas background
- Node details popup with AI summaries

### State Management
- Centralized state with Zustand
- Persistent workspace management
- Chat history and message tracking
- Node and edge synchronization

## Future Enhancements

- [ ] Voice-to-text integration
- [ ] Image-to-text support
- [ ] Real AI orchestration backend
- [ ] RAG implementation for document analysis
- [ ] Executive Report view
- [ ] Export/Import functionality
- [ ] Collaboration features

## License

MIT

