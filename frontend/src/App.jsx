import React from 'react'
import {Route, Routes} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import EmailVerified from './pages/EmailVerified'
import ResetPassword from './pages/ResetPassword'
import { ToastContainer } from 'react-toastify';



const App = () => {
  return (
    <div>
     <ToastContainer/>
     <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/email-verified' element={<EmailVerified/>}/>
      <Route path='/reset-password' element={<ResetPassword/>}/>
     </Routes>
    </div>
  )
}

export default App