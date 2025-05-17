import React from 'react'
import ImageResizer from './components/ImageResizer'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.05]"></div>
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <ImageResizer />
      </div>
    </div>
  )
}

export default App
