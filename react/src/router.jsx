import { createBrowserRouter } from 'react-router-dom'
import Register from './auth/register'
import Home from './views/home'
import Login from './auth/login'
import Profile from './views/profile'
const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/register', element: <Register /> },
  { path: '/login', element: <Login /> },
  { path: '/profile', element: <Profile /> },
])

export default router