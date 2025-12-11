import { useState } from 'react'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import LandingPage from './Pages/LandingPage'
import SignInPage from './Pages/SignInPage'

import './App.css'

function App() {
    return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/signin" element={<SignInPage/>}/>
      </Routes>
    </Router>
  )
}

export default App
