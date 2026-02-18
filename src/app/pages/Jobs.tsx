
import { Plus, Upload, Calendar } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/Dialog"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getJobs } from "../Reducer/JobSlice"
import AddJobsModal from "./Modals/AddJobsModal"
export function Jobs() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const{allJobs}=useSelector((state)=>state?.jobs)
  const dispatch=useDispatch()
  // const jobs = [
  //   { id: 1, client: "Amazon", role: "Full-stack Engineer", date: "2023-10-25", candidates: 12 },
  //   { id: 2, client: "Uber", role: "Backend Developer", date: "2023-10-24", candidates: 8 },
  //   { id: 3, client: "Netflix", role: "Senior Frontend", date: "2023-10-22", candidates: 15 },
  //   { id: 4, client: "Airbnb", role: "Product Designer", date: "2023-10-20", candidates: 5 },
  // ]

  useEffect(()=>{
    dispatch(getJobs())
  },[])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Active Jobs</h2>
        {/* <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#800080] hover:bg-[#660066] text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Jobs
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Schedule New Interview</DialogTitle>
              <DialogDescription>
                Add candidate details and configure the interview session.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">Candidate Name</label>
                <Input id="name" placeholder="John Doe" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                  <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
                </div>
              </div>
              
              <div className="grid gap-2">
                <label className="text-sm font-medium">Resume</label>
                <div className="flex items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-6 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400">PDF, DOCX up to 10MB</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Coding Assessment</label>
                  <p className="text-xs text-gray-500">Enable live coding environment</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#800080] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#800080]"></div>
                </label>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Date & Time</label>
                <div className="flex gap-2">
                   <Input type="date" className="flex-1" />
                   <Input type="time" className="w-32" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-[#800080] hover:bg-[#660066]" onClick={() => setIsModalOpen(false)}>Send Invitation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog> */}
              <Button
              className="bg-[#800080] hover:bg-[#660066] text-white"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Job
            </Button>
            {
              isModalOpen&&(
                <AddJobsModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                />
              )
            }
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>Role</TableHead>
                 <TableHead>Job Description</TableHead>
                <TableHead>Date Added</TableHead>
                {/* <TableHead className="text-right">Candidates</TableHead>
                <TableHead className="text-right">Actions</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {allJobs?.data?.map((jobData) => (
                <TableRow key={jobData.id}>
                  <TableCell className="font-medium">{jobData.clientName}</TableCell>
                  <TableCell>{jobData.role}</TableCell>
                  <TableCell className="whitespace-pre-line">{jobData.jd}</TableCell>
                  <TableCell> {new Date(jobData.createdAt).toISOString().split("T")[0]}</TableCell>
                  {/* <TableCell className="text-right">{jobData.candidates}</TableCell> */}
                  {/* <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                      </svg>
                    </Button>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
