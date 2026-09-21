import { 
    BrowserRouter, 
    Route, Routes
} from 'react-router-dom'

import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import SignUp from './pages/SignUp.jsx'
import Navbar from './components/Navbar.jsx'
import Signin from './pages/Signin.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'

const App = () => {
  return (
    <BrowserRouter>

    {/* header */}

    <Navbar />

    
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/about' element={<About />}/>
        <Route path='/register' element={ <SignUp />}/>
        <Route path='/reset-password/:token' element={<ResetPassword />}/>
        <Route path='/signin' element={<Signin />}/>
        <Route path='/forgot-password' element={<ForgotPassword />}/>
        <Route path='/dashboard' element={<ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App