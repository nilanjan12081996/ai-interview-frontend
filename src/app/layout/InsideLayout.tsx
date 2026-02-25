// import * as React from "react"
// import { Home, Briefcase, Users, UserCog, Settings, LogOut, Bell, Search, Menu, X, ChevronLeft, ChevronRight } from "lucide-react"
// import { Button } from "../components/ui/Button"
// import { Input } from "../components/ui/Input"

// interface LayoutProps {
//   children: React.ReactNode
//   currentView: string
//   onViewChange: (view: string) => void
//   onLogout: () => void
// }

// export function Layout({ children, currentView, onViewChange, onLogout }: LayoutProps) {
//   const [sidebarOpen, setSidebarOpen] = React.useState(true)
//   const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

//   const navItems = [
//     { id: "dashboard", label: "Dashboard", icon: Home },
//     { id: "jobs", label: "Jobs", icon: Briefcase },
//     { id: "candidates", label: "Candidates", icon: Users },
//     { id: "hr", label: "HR Management", icon: UserCog },
//     { id: "settings", label: "Settings", icon: Settings },
//   ]

//   const handleNavClick = (viewId: string) => {
//     onViewChange(viewId)
//     setMobileMenuOpen(false)
//   }

//   return (
//     <div className="flex h-screen bg-gray-50 text-gray-900">
//       {/* Mobile Sidebar Overlay */}
//       {mobileMenuOpen && (
//         <div 
//           className="fixed inset-0 z-40 bg-black/50 md:hidden"
//           onClick={() => setMobileMenuOpen(false)}
//         />
//       )}

//       {/* Sidebar Navigation */}
//       <aside 
//         className={`
//           fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-white transition-all duration-300
//           ${mobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full"}
//           md:relative md:translate-x-0 
//           ${sidebarOpen ? "md:w-64" : "md:w-16"}
//         `}
//       >
//         <div className="flex h-16 items-center justify-between border-b px-4">
//           <div className="flex items-center gap-2 font-bold text-[#800080] overflow-hidden whitespace-nowrap">
//             <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-[#800080] text-white">
//               AI
//             </div>
//             <span className={`text-xl transition-opacity duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0 md:hidden"}`}>
//               Interviewer
//             </span>
//           </div>
          
//           {/* Desktop Collapse Button */}
//           <button 
//             className="hidden md:block text-gray-400 hover:text-gray-600"
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//           >
//              {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
//           </button>

//           {/* Mobile Close Button */}
//           <button 
//             className="md:hidden text-gray-500"
//             onClick={() => setMobileMenuOpen(false)}
//           >
//             <X className="h-6 w-6" />
//           </button>
//         </div>
        
//         <nav className="flex-1 space-y-1 p-2 overflow-y-auto overflow-x-hidden">
//           {navItems.map((item) => (
//             <button
//               key={item.id}
//               onClick={() => handleNavClick(item.id)}
//               className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
//                 currentView === item.id
//                   ? "bg-purple-50 text-[#800080]"
//                   : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
//               }`}
//               title={!sidebarOpen ? item.label : undefined}
//             >
//               <item.icon className="h-5 w-5 flex-shrink-0" />
//               <span className={`transition-opacity duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0 md:hidden"} whitespace-nowrap`}>
//                 {item.label}
//               </span>
//             </button>
//           ))}
//         </nav>
        
//         <div className="border-t p-2">
//           <button
//             onClick={onLogout}
//             className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600"
//             title={!sidebarOpen ? "Logout" : undefined}
//           >
//             <LogOut className="h-5 w-5 flex-shrink-0" />
//             <span className={`transition-opacity duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0 md:hidden"} whitespace-nowrap`}>
//               Logout
//             </span>
//           </button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex flex-1 flex-col overflow-hidden w-full">
//         {/* Header */}
//         <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
//           <div className="flex items-center gap-4">
//             <button 
//               className="md:hidden text-gray-500"
//               onClick={() => setMobileMenuOpen(true)}
//             >
//               <Menu className="h-6 w-6" />
//             </button>
//             <h1 className="text-lg font-semibold capitalize text-gray-800">{currentView.replace('-', ' ')}</h1>
//           </div>
//           <div className="flex items-center gap-2 md:gap-4">
//             <div className="relative hidden md:block">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
//               <Input
//                 placeholder="Search..."
//                 className="w-64 pl-9"
//               />
//             </div>
//             <Button variant="ghost" size="icon" className="relative text-gray-500">
//               <Bell className="h-5 w-5" />
//               <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
//             </Button>
//             <div className="flex items-center gap-2">
//               <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-medium text-[#800080]">
//                 AD
//               </div>
//               <div className="hidden text-sm md:block">
//                 <p className="font-medium">Admin User</p>
//                 <p className="text-xs text-gray-500">admin@interviewer.ai</p>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Scrollable Content */}
//         <div className="flex-1 overflow-auto p-4 md:p-6">
//           {children}
//         </div>
//       </main>
//     </div>
//   )
// }

























import * as React from "react"
import {
  Home,
  Briefcase,
  Users,
  UserCog,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { useDispatch } from "react-redux"
import { logout } from "../Reducer/AuthSlice"

export function InsideLayout() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const navigate = useNavigate()
  const location = useLocation()
const dispatch=useDispatch()
  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/jobs", label: "Jobs", icon: Briefcase },
    { path: "/candidates", label: "Candidates", icon: Users },
    { path: "/hr", label: "Recruiter Management", icon: UserCog },
    { path: "/settings", label: "Settings", icon: Settings },
  ]

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-white transition-all duration-300
          ${mobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full"}
          md:relative md:translate-x-0 
          ${sidebarOpen ? "md:w-64" : "md:w-16"}
        `}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2 font-bold text-[#800080]">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-[#800080] text-white">
              AI
            </div>
            {sidebarOpen && <span className="text-xl">Interviewer</span>}
          </div>

          <button
            className="hidden md:block text-gray-400 hover:text-gray-600"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <ChevronLeft size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </button>

          <button
            className="md:hidden text-gray-500"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path

            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path)
                  setMobileMenuOpen(false)
                }}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-purple-50 text-[#800080]"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="border-t p-2">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Section */}
      <main className="flex flex-1 flex-col overflow-hidden w-full">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-gray-500"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            <h1 className="text-lg font-semibold capitalize text-gray-800">
              {location.pathname.replace("/", "")}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input placeholder="Search..." className="w-64 pl-9" />
            </div>

            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-medium text-[#800080]">
              AD
            </div>
          </div>
        </header>

        {/* Routed Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

