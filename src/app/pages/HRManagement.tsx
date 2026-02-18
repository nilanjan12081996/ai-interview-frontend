
import { Plus, UserX } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/Dialog"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { getHrUser, HrUserStatusToggle } from "../Reducer/HrSlice"
import CreateHrModal from "./Modals/CreateHrModal"
import { ToastContainer } from "react-toastify"

// const hrUsers = [
//   { id: 1, name: "Alice Johnson", email: "alice@company.com", status: "Active" },
//   { id: 2, name: "Bob Smith", email: "bob@company.com", status: "Inactive" },
//   { id: 3, name: "Charlie Davis", email: "charlie@company.com", status: "Active" },
// ]

export function HRManagement() {
  const{hrUsers}=useSelector((state)=>state?.hr)
  const dispatch=useDispatch()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [users, setUsers] = useState(hrUsers)

  useEffect(()=>{
    dispatch(getHrUser())
  },[])

  console.log("hrUsers",hrUsers);
  
const toggleStatus = (id) => {
  console.log(id)
  
  dispatch(HrUserStatusToggle({ id })).then((res) => {
    if (res?.payload?.status_code === 200) {
      dispatch(getHrUser())
    }
  })
}

  return (
    <div className="space-y-6">
      <ToastContainer/>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">HR Management</h2>
                <Button
                  className="bg-[#800080] hover:bg-[#660066] text-white"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add HR User
                </Button>
     
          {
            isModalOpen&&(
              <CreateHrModal
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
                />
            )
          }
        
      </div>

      <Card>
        <CardHeader>
          <CardTitle>HR Team Members</CardTitle>
          <CardDescription>Manage access and permissions for HR staff.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hrUsers?.data?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.firstName + " "+user?.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                   <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={user.status === 1}
                          onChange={() => toggleStatus(user.id)}
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#800080] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#800080]"></div>
                        <span className="ml-2 text-sm text-gray-700"> {user.status === 1 ? "Active" : "Inactive"}</span>
                      </label>
                    </div>
                  </TableCell>
                  <TableCell>Recruiter</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                       <Button variant="outline" size="sm" className="text-xs">Reset Password</Button>
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700">
                         <UserX className="h-4 w-4" />
                       </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
