
import { Plus, Upload, Calendar } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/Dialog"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getJobs, getSingleJob, jobStatusToggle } from "../Reducer/JobSlice"
import AddJobsModal from "./Modals/AddJobsModal"
import { IoMdSend } from "react-icons/io";
import InterviewModal from "./Modals/InterviewModal"
import { ToastContainer } from "react-toastify"
import { BsPencil } from "react-icons/bs";
import { RiDeleteBin2Line } from "react-icons/ri";
import JobEditModal from "./Modals/JobEditModal"
import JobDeleteModal from "./Modals/JobDeleteModal"
import { useNavigate } from "react-router"
import JdModalView from "./Modals/JdModalView"
export function Jobs() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const[inviteModalOpen,setInviteModalOpen]=useState(false)
  const[openEditModal,setOpenEditModal]=useState(false)
  const[openDeleteModal,setOpenDeleteModal]=useState(false)
  const[jobid,setJobId]=useState()
  const{allJobs}=useSelector((state)=>state?.jobs)
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const[showJdModal,setShowJdModal]=useState(false)
  const[showJd,setShowJd]=useState("")
  // const jobs = [
  //   { id: 1, client: "Amazon", role: "Full-stack Engineer", date: "2023-10-25", candidates: 12 },
  //   { id: 2, client: "Uber", role: "Backend Developer", date: "2023-10-24", candidates: 8 },
  //   { id: 3, client: "Netflix", role: "Senior Frontend", date: "2023-10-22", candidates: 15 },
  //   { id: 4, client: "Airbnb", role: "Product Designer", date: "2023-10-20", candidates: 5 },
  // ]

  useEffect(()=>{
    dispatch(getJobs())
  },[])

  const handleInvitation=(id)=>{
    // console.log("id",id);
    
    // setJobId(id)
    // setInviteModalOpen(true)
    navigate("/candidate-list",{state:{id:id}})
  }

  const toggleStatus = (id) => {
    console.log(id)
    
    dispatch(jobStatusToggle({ id })).then((res) => {
      if (res?.payload?.statusCode === 200) {
        dispatch(getJobs())
      }
    })
  }
  const handleEditModal=(id)=>{
    dispatch(getSingleJob({id:id}))
    setJobId(id)
    setOpenEditModal(true)
  }
  
  const handleDeleteModal=(id)=>{
      setJobId(id)
      setOpenDeleteModal(true)
  }

  const handleJdShow=(jd)=>{
    setShowJdModal(true)
    setShowJd(jd)
  }
  return (
    <div className="space-y-6">
      <ToastContainer/>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Active Jobs</h2>
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

             {
              openEditModal&&(
                <JobEditModal
                openEditModal={openEditModal}
                setOpenEditModal={setOpenEditModal}
                jobid={jobid}
                />
              )
            }
              {
              openDeleteModal&&(
                <JobDeleteModal
                openDeleteModal={openDeleteModal}
                setOpenDeleteModal={setOpenDeleteModal}
                jobid={jobid}
                />
              )
            }
            {
              showJdModal&&(
                <JdModalView
                showJdModal={showJdModal}
                setShowJdModal={setShowJdModal}
                showJd={showJd}
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
                 <TableHead>Nice to have Skills</TableHead>
                 <TableHead>Mandatory Skills</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Status</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>&nbsp;</TableHead>
                <TableHead>&nbsp;</TableHead>
                {/* <TableHead className="text-right">Candidates</TableHead>
                <TableHead className="text-right">Actions</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {allJobs?.data?.map((jobData) => (
                <TableRow key={jobData.id}>
                  <TableCell className="font-medium">{jobData.clientName}</TableCell>
                  <TableCell>{jobData.role}</TableCell>
                  <TableCell className="whitespace-pre-line max-w-[900px]">
                    <div className={`overflow-hidden transition-all duration-300`}>
                    <span>{jobData.jd.slice(0, 100)}...</span>
                  <Button onClick={()=>{handleJdShow(jobData.jd)}} className="text-blue-950">read more</Button>  
                    </div>
                    </TableCell>
                    <TableCell>{jobData?.mustHaveSkills?.map((skills)=>{
                      return(
                        <>
                         {skills?.skillName}<br/>
                        </>
                      )
                     
                    })}</TableCell>
                     <TableCell>{jobData?.mandatorySkills?.map((skills)=>{
                      return(
                        <>
                         {skills?.skillName}<br/>
                        </>
                      )
                     
                    })}</TableCell>
                    <TableCell>
                      {jobData.experience}
                    </TableCell>
                    <TableCell className="whitespace-pre-line">

                       <div className="flex items-center gap-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={jobData.status === 1}
                           onChange={() => toggleStatus(jobData.id)}
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#800080] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#800080]"></div>
                        <span className="ml-2 text-sm text-gray-700"> {jobData.status === 1 ? "Active" : "Inactive"}</span>
                      </label>
                    </div>
                    </TableCell>
                  <TableCell> {new Date(jobData.createdAt).toISOString().split("T")[0]}</TableCell>
                  <TableCell> 

                    {/* <Button onClick={()=>handleInvitation(jobData.id)} className="bg-[#800080] text-white">
                     Send invitation <IoMdSend /> 
                    </Button> */}
                      <Button onClick={()=>handleInvitation(jobData.id)} className="bg-[#800080] text-white">
                     View Candidates
                    </Button>
                  </TableCell>
                  <TableCell>
                  <BsPencil onClick={()=>{handleEditModal(jobData.id)}} className="text-[#800080] text-[19px] cursor-pointer"/>
                  </TableCell>
                  <TableCell>
                    <RiDeleteBin2Line onClick={()=>{handleDeleteModal(jobData.id)}} className="text-[#800080] text-[19px]  cursor-pointer"/>
                  </TableCell>
               
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* {
        inviteModalOpen&&(
          <InterviewModal
          inviteModalOpen={inviteModalOpen}
          setInviteModalOpen={setInviteModalOpen}
          jobid={jobid}
          />
        )
      } */}
    </div>
  )
}
