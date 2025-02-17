
import { createBrowserRouter } from "react-router-dom";
import Register from "./auth/register";
import Home from "./views/home";
import Login from "./auth/login";
import Profile from "./views/profile";
import Layout from "./views/Layout";
import AuthCallback from "./auth/google-callback.jsx";
import AskQuestion from "./views/AskQuestion.jsx";
import ProtectedRoute from "./components/protectedRoute.jsx";
import About from './views/About.jsx';
import PostPage from "./views/PostPage";
import UpdatePost from "./views/updatePost.jsx";
import PostByTag from "./views/postByTag.jsx";
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [

      { path: "/", element: <Home /> },
      { path: "/register", element: <Register /> },
      { path: "/login", element: <Login /> },
      { path: "/auth/google-callback", element: <AuthCallback /> },
      { path: '/about', element: <About /> },
      { path: "/posts-by-tag/:tag_id", element: <PostByTag /> },
      // Protected routes
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/profile", element: <Profile /> },
          { path: "/ask-question", element: <AskQuestion /> },
          { path: "/myposts", element: <PostPage /> },
          { path: "/edit-post/:postId", element: <UpdatePost /> },



        ],
      },
    ],
  },
]);

export default router;

