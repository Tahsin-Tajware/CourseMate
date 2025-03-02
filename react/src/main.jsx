import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import router from './router.jsx'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/authContext.jsx'
import Notifications from './components/notification.jsx'
import { Toaster } from 'sonner'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Toaster richColors />
      <Notifications />
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
