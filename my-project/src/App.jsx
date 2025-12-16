import { useState } from 'react'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import LandingPage from './LandingPage_components/LandingPage'
import SignInPage from './LandingPage_components/SignInPage'
import RegisterUser from './LandingPage_components/RegisterUser'
import ChoiceScreen from './Onboarding_components/ChoiceScreen'
import Survey from './Onboarding_components/Survey'
import DashboardPage from './Dashboard/DashboardPage'
import './App.css'

function App() {
    return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/signin" element={<SignInPage/>}/>
        <Route path="/signup" element={<RegisterUser/>}/>
        <Route path='/onboarding' element={<ChoiceScreen/>}/>
        <Route path='/survey' element={<Survey/>}/>
        <Route path='/dashboard' element={<DashboardPage/>}/>
      </Routes>
    </Router>
  )
}

export default App
