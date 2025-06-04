import { useEffect, createContext } from 'react'
import { createBrowserRouter, RouterProvider, useParams } from 'react-router-dom';

import './App.css'
import './Navbar.css'
import './CoverPage.css'
import Navbar from './component/Navbar.jsx';
import CoverLetter from './component/CoverPage.jsx';
import Home from './component/Home.jsx';
import ChatAdmin from './component/ChatAdmin.jsx';
import ProtectedRoute from './component/ProtectedRoute.jsx';
import AddChatPage from './component/AddChatPage.jsx';
import SupportChatDocumentation from './component/SupportChatDocumentation.jsx';
import Unautherized from './component/Unautherized.jsx';
import AssignmentHome from './component/AssignmentHome.jsx';

function App() {
  useEffect(() => {
  }, [])
  const data = createContext();
  const router = createBrowserRouter([
    {
      path: "/",
      element: <data.Provider value={"test"}><Navbar /><CoverLetter /></data.Provider>
    },
    {
      path: "/about",
      element: <data.Provider value={"test"}><Navbar /><Home /></data.Provider>
    },
    {
      path: '/chatadmin',
      element: <data.Provider value={"test"}><Navbar /><ChatAdmin /></data.Provider>
    },
    {
      path: "/chatadminhome",
      element: <ProtectedRoute element={<data.Provider value={"This is  Protected route"}><Navbar /><AddChatPage /></data.Provider>} />
    },
    {
      path: "/supportchatdocumentation",
      element: <SupportChatDocumentation />
    },
    {
      path: "/unautherized",
      element: <Unautherized />
    },
    {
      path: "/Assignment",
      element: <data.Provider value={"test"}><Navbar /><AssignmentHome /></data.Provider>
    },
  ])
  return (
    <RouterProvider router={router} />
  )
}

export default App
