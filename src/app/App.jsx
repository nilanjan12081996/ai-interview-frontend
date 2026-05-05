


import { RouterProvider, createBrowserRouter } from "react-router-dom"
import RoutesConfig from "./RouteConfig"

const router = createBrowserRouter(RoutesConfig)

export default function App() {
  return (
   <RouterProvider router={router} />
  )
}

