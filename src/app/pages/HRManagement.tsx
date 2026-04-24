import { Plus, UserX, Search } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { getHrUser, HrUserStatusToggle } from "../Reducer/HrSlice"
import CreateHrModal from "./Modals/CreateHrModal"
import { ToastContainer } from "react-toastify"

export function HRManagement() {
  const { hrUsers } = useSelector((state) => state?.hr)
  const dispatch = useDispatch()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [search, setSearch] = useState("")
  const user_type = sessionStorage.getItem("role")

  useEffect(() => {
    dispatch(getHrUser())
  }, [])

  const toggleStatus = (id) => {
    dispatch(HrUserStatusToggle({ id })).then((res) => {
      if (res?.payload?.status_code === 200) {
        dispatch(getHrUser())
      }
    })
  }

  const filtered = (hrUsers?.data ?? []).filter((u) => {
    const q = search.toLowerCase()
    return (
      !search ||
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-5 p-1">
      <ToastContainer />

      {/* ── Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Recruiter Management</h2>
          <p className="text-sm text-gray-400 mt-0.5">{filtered.length} team member{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search recruiters..."
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#cc66cc] focus:border-[#800080] bg-white shadow-sm transition"
            />
          </div>

          {/* Add Button (SUPER_ADMIN only) */}
          {user_type === "SUPER_ADMIN" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#800080] text-white hover:bg-[#6a006a] transition-colors shadow-sm whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Add Recruiter
            </button>
          )}
        </div>
      </div>

      {/* ── Table Card ── */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-700">HR Team Members</p>
          <p className="text-xs text-gray-400 mt-0.5">Manage access and permissions for HR staff.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {["Name", "Email", "Username", "Role", "Status", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-[#f9f0f9]/40 transition-colors duration-100">

                  {/* Name */}
                  <td className="px-5 py-3 text-center font-medium text-gray-800 whitespace-nowrap">
                    {user.firstName + " " + user?.lastName}
                  </td>

                  {/* Email */}
                  <td className="px-5 py-3 text-center text-gray-500 text-xs whitespace-nowrap">
                    {user.email}
                  </td>

                  {/* Username */}
                  <td className="px-5 py-3 text-center text-gray-500 text-xs whitespace-nowrap">
                    {user.username}
                  </td>

                  {/* Role */}
                  <td className="px-5 py-3 text-center">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#f9f0f9] text-[#800080]">
                      Recruiter
                    </span>
                  </td>

                  {/* Status Toggle */}
                  <td className="px-5 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={user.status === 1}
                          onChange={() => toggleStatus(user.id)}
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#800080] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#800080]"></div>
                      </label>
                      <span className={`text-xs font-medium ${user.status === 1 ? "text-emerald-600" : "text-gray-400"}`}>
                        {user.status === 1 ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3 text-center">
                    <div className="flex justify-center">
                      <button
                        title="Remove user"
                        className="flex items-center justify-center w-8 h-8 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-150"
                      >
                        <UserX className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Empty state */}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Search className="w-8 h-8 opacity-30" />
                      <p className="text-sm font-medium">No recruiters found</p>
                      <p className="text-xs">Try adjusting your search query</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-400">Showing {filtered.length} recruiter{filtered.length !== 1 ? "s" : ""}</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <CreateHrModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  )
}

// import { Plus, UserX } from "lucide-react"
// import { Button } from "../components/ui/Button"
// import { Input } from "../components/ui/Input"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table"
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/Dialog"
// import { useDispatch, useSelector } from "react-redux"
// import { useEffect, useState } from "react"
// import { getHrUser, HrUserStatusToggle } from "../Reducer/HrSlice"
// import CreateHrModal from "./Modals/CreateHrModal"
// import { ToastContainer } from "react-toastify"

// // const hrUsers = [
// //   { id: 1, name: "Alice Johnson", email: "alice@company.com", status: "Active" },
// //   { id: 2, name: "Bob Smith", email: "bob@company.com", status: "Inactive" },
// //   { id: 3, name: "Charlie Davis", email: "charlie@company.com", status: "Active" },
// // ]

// export function HRManagement() {
//   const{hrUsers}=useSelector((state)=>state?.hr)
//   const dispatch=useDispatch()
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [users, setUsers] = useState(hrUsers)
//   const user_type=sessionStorage.getItem("role")
//   console.log("user_type",user_type);
  

//   useEffect(()=>{
//     dispatch(getHrUser())
//   },[])

//   console.log("hrUsers",hrUsers);
  
// const toggleStatus = (id) => {
//   console.log(id)
  
//   dispatch(HrUserStatusToggle({ id })).then((res) => {
//     if (res?.payload?.status_code === 200) {
//       dispatch(getHrUser())
//     }
//   })
// }

//   return (
//     <div className="space-y-6">
//       <ToastContainer/>
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <h2 className="text-2xl font-bold tracking-tight">Recruiter Management</h2>
//         {
//           user_type==="SUPER_ADMIN"&&(
//             <>
//             <Button
//                   className="bg-[#800080] hover:bg-[#660066] text-white"
//                   onClick={() => setIsModalOpen(true)}
//                 >
//                   <Plus className="mr-2 h-4 w-4" />
//                   Add Recruiter
//                 </Button>
//             </>
//           )
//         }
                
     
//           {
//             isModalOpen&&(
//               <CreateHrModal
//               isModalOpen={isModalOpen}
//               setIsModalOpen={setIsModalOpen}
//                 />
//             )
//           }
        
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>HR Team Members</CardTitle>
//           <CardDescription>Manage access and permissions for HR staff.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Name</TableHead>
//                 <TableHead>Email</TableHead>
//                 <TableHead>Username</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Role</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {hrUsers?.data?.map((user) => (
//                 <TableRow key={user.id}>
//                   <TableCell className="font-medium">{user.firstName + " "+user?.lastName}</TableCell>
//                   <TableCell>{user.email}</TableCell>
//                    <TableCell>{user.username}</TableCell>
//                   <TableCell>
//                     <div className="flex items-center gap-2">
//                       <label className="relative inline-flex items-center cursor-pointer">
//                         <input 
//                           type="checkbox" 
//                           className="sr-only peer" 
//                           checked={user.status === 1}
//                           onChange={() => toggleStatus(user.id)}
//                         />
//                         <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#800080] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#800080]"></div>
//                         <span className="ml-2 text-sm text-gray-700"> {user.status === 1 ? "Active" : "Inactive"}</span>
//                       </label>
//                     </div>
//                   </TableCell>
//                   <TableCell>Recruiter</TableCell>
//                   <TableCell className="text-right">
//                     <div className="flex justify-end gap-2">
//                        {/* <Button variant="outline" size="sm" className="text-xs">Reset Password</Button> */}
//                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700">
//                          <UserX className="h-4 w-4" />
//                        </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
