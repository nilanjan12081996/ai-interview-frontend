import { Navigate } from "react-router"
import OutsideLayout from "../ui/OutsideLayout"
import Login from "./pages/Login"
import { InsideLayout } from "./layout/InsideLayout"
import { Dashboard } from "./pages/Dashboard"
import { Jobs } from "./pages/Jobs"
import { Candidates } from "./pages/Candidates"
import { HRManagement } from "./pages/HRManagement"
import ProtectedRoute from "./components/ProtectedRoute"
import InterviewRoom from "./pages/interview/InterviewRoom"

const RoutesConfig = [
  // =========================
  // OUTSIDE LAYOUT (Auth Pages)
  // =========================
  {
    path: "/",
    element: <OutsideLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: "login",
        element: <Login />,
      },
   
   
    
    ],
  },

    {
    path: "/",
    element: <OutsideLayout />,
    children: [
  
      {
        path: "interview/:token",
        element: <InterviewRoom />,
      },
   
   
    
    ],
  },

  // =========================
  // INSIDE LAYOUT (Protected Pages)
  // =========================
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <InsideLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "jobs",
        element: <Jobs />,
      },
      {
        path: "candidates",
        element: <Candidates />,
      },
      {
        path: "hr",
        element: <HRManagement />,
      },

      // Optional Settings Page
      {
        path: "settings",
        element: (
          <div className="p-4 text-center text-gray-500">
            Settings page placeholder
          </div>
        ),
      },
    ],
  },

  // =========================
  // 404 Page
  // =========================
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]

export default RoutesConfig