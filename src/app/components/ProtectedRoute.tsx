import { Navigate, useLocation } from "react-router-dom"

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = sessionStorage.getItem("ai_interview_token")
  const location = useLocation()

  // If user is NOT logged in → redirect to login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If logged in → allow access
  return <>{children}</>
}

export default ProtectedRoute
