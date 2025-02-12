import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import HabitForm from './components/HabitForm'
import Navigation from './components/Navigation'

function App() {
  return (
    <div className="app">
      <Navigation />
      <main className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<HabitForm />} />
          <Route path="/edit/:id" element={<HabitForm />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
