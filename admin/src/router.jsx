import React from 'react';  // Add this line
import { createBrowserRouter } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import SignIn from './pages/auth/signIn';
import ReportsPage from "./pages/ReportsPage";
const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        {path: '/login', element: <SignIn/>},
        {path: '/reports', element: <ReportsPage/>},
        // { path: '/about', element: <About /> },
        // Protected routes
        // {
        //   element: <ProtectedRoute />,
        //   children: [
        //     // { path: "/profile", element: <Profile /> },
        //     // { path: "/ask-question", element: <AskQuestion /> },
        //   ],
        // },
      ],
    },
]);

export default router;
