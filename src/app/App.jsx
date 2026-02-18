

import { RouterProvider, createBrowserRouter } from "react-router-dom"
import RoutesConfig from "./RouteConfig"

export default function App() {
const router = createBrowserRouter(RoutesConfig)

  return (
   <RouterProvider router={router} />
  )
}
