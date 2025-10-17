import { Routes, Route, Navigate } from 'react-router-dom'
import Hero from './components/Hero'
import Footer from './components/Footer'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/garantizado" replace />} />
      <Route path="/garantizado" element={
        <div className="min-h-screen flex flex-col">
          <Hero />
          <Footer />
        </div>
      } />
    </Routes>
  )
}

export default App
