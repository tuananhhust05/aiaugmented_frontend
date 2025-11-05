import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import DecisionCanvas from './pages/DecisionCanvas'
import SummaryEditor from './pages/SummaryEditor'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/decision" element={<DecisionCanvas />} />
      <Route path="/decision/summary-editor" element={<SummaryEditor />} />
    </Routes>
  )
}

export default App

