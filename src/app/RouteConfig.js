import { Navigate } from "react-router"
import OutsideLayout from "../ui/OutsideLayout"
import Login from "./pages/Login"
import LandingPage from "./pages/LandingPage"
import { InsideLayout } from "./layout/InsideLayout"
import { Dashboard } from "./pages/Dashboard"
import { Jobs } from "./pages/Jobs"
import { Candidates } from "./pages/Candidates"
import { HRManagement } from "./pages/HRManagement"
import ProtectedRoute from "./components/ProtectedRoute"
import InterviewRoom from "./pages/interview/InterviewRoom"
import CandidateByJob from "./pages/CandidateByJob"
import Setting from "./pages/Setting"
import Coding from "./pages/Coding"

const RoutesConfig = [
  // =========================
  // LANDING PAGE
  // =========================
  {
    path: "/",
    element: <LandingPage />,
  },
  // =========================
  // OUTSIDE LAYOUT (Auth Pages)
  // =========================
  {
    path: "/",
    element: <OutsideLayout />,
    children: [
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
        path: "candidate-list",
        element: <CandidateByJob />,
      },
      {
        path: "hr",
        element: <HRManagement />,
      },
      {
        path: "coding",
        element: <Coding />,
      },
      {
        path: "settings",
        element: <Setting />,
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