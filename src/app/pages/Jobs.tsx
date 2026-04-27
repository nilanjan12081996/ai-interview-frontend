import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { BsPencil } from "react-icons/bs"
import { RiDeleteBin2Line } from "react-icons/ri"
import { IoMdSend } from "react-icons/io"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getJobs, getSingleJob, jobStatusToggle } from "../Reducer/JobSlice"
import AddJobsModal from "./Modals/AddJobsModal"
import InterviewModal from "./Modals/InterviewModal"
import { ToastContainer } from "react-toastify"
import JobEditModal from "./Modals/JobEditModal"
import JobDeleteModal from "./Modals/JobDeleteModal"
import { useNavigate } from "react-router"
import JdModalView from "./Modals/JdModalView"

const PAGE_SIZE = 10

// ─── Skill Pill ───────────────────────────────────────────────────────────────
function SkillPill({ name, color = "purple" }) {
  const colors = {
    purple: "bg-[#f9f0f9] text-[#800080]",
    blue:   "bg-blue-50 text-blue-700",
  }
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mr-1 mb-1 ${colors[color]}`}>
      {name}
    </span>
  )
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ total, page, onPage }) {
  const totalPages = Math.ceil(total / PAGE_SIZE)
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const visible = pages.filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
  const withEllipsis = []
  visible.forEach((p, i) => {
    if (i > 0 && p - visible[i - 1] > 1) withEllipsis.push("…")
    withEllipsis.push(p)
  })

  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
      <p className="text-xs text-gray-400">
        Showing {Math.min((page - 1) * PAGE_SIZE + 1, total)}–{Math.min(page * PAGE_SIZE, total)} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className="flex items-center justify-center w-7 h-7 rounded-md text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {withEllipsis.map((item, i) =>
          item === "…" ? (
            <span key={`e${i}`} className="w-7 text-center text-xs text-gray-400">…</span>
          ) : (
            <button
              key={item}
              onClick={() => onPage(item)}
              className={`w-7 h-7 rounded-md text-xs font-medium transition ${
                item === page ? "bg-[#800080] text-white shadow-sm" : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              {item}
            </button>
          )
        )}
        <button
          onClick={() => onPage(page + 1)}
          disabled={page === Math.ceil(total / PAGE_SIZE)}
          className="flex items-center justify-center w-7 h-7 rounded-md text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function Jobs() {
  const [isModalOpen, setIsModalOpen]       = useState(false)
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [openEditModal, setOpenEditModal]   = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [jobid, setJobId]                   = useState()
  const [showJdModal, setShowJdModal]       = useState(false)
  const [showJd, setShowJd]                 = useState("")
  const [search, setSearch]                 = useState("")
  const [page, setPage]                     = useState(1)
  const [modalTitle, setModalTitle]         = useState("Details")


  const { allJobs } = useSelector((state) => state?.jobs)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => { dispatch(getJobs()) }, [])
  useEffect(() => { setPage(1) }, [search])

  const handleInvitation = (id) => navigate("/candidate-list", { state: { id } })

  const toggleStatus = (id) => {
    dispatch(jobStatusToggle({ id })).then((res) => {
      if (res?.payload?.statusCode === 200) dispatch(getJobs())
    })
  }

  const handleEditModal = (id) => {
    dispatch(getSingleJob({ id }))
    setJobId(id)
    setOpenEditModal(true)
  }

  const handleDeleteModal = (id) => {
    setJobId(id)
    setOpenDeleteModal(true)
  }

  const handleJdShow = (content, title = "Details") => {
    setShowJdModal(true)
    setShowJd(content)
    setModalTitle(title)
  }


  // newest first, then search filter
  const allData = [...(allJobs?.data ?? [])].reverse()
  const filtered = allData.filter((j) => {
    const q = search.toLowerCase()
    return (
      !search ||
      j.clientName?.toLowerCase().includes(q) ||
      j.role?.toLowerCase().includes(q)
    )
  })

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const HEADERS = [
    "Client Name", "Role", "Job Description", "Nice to Have",
    "Mandatory Skills", "Experience", "Status", "Date Added", "Actions",
  ]

  return (
    <div className="space-y-5 p-1">
      <ToastContainer />

      {/* ── Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Active Jobs</h2>
          <p className="text-sm text-gray-400 mt-0.5">{filtered.length} job listing{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search jobs..."
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#cc66cc] focus:border-[#800080] bg-white shadow-sm transition"
            />
          </div>
          {/* Add Job */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#800080] text-white hover:bg-[#6a006a] transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Job
          </button>
        </div>
      </div>

      {/* ── Table Card ── */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-700">Job Listings</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {HEADERS.map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {paginated.map((jobData) => (
                <tr key={jobData.id} className="hover:bg-[#f9f0f9]/40 transition-colors duration-100">

                  {/* Client Name */}
                  <td className="px-4 py-3 text-center font-medium text-gray-800 whitespace-nowrap">
                    {jobData.clientName}
                  </td>

                  {/* Role */}
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#f9f0f9] text-[#800080]">
                      {jobData.role}
                    </span>
                  </td>

                  {/* Job Description */}
                  <td className="px-4 py-3 text-center" style={{ minWidth: "220px", maxWidth: "280px" }}>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {jobData.jd.length > 100 ? `${jobData.jd.slice(0, 100)}...` : jobData.jd}
                    </p>
                    {jobData.jd.length > 100 && (
                      <button
                        onClick={() => handleJdShow(jobData.jd, "Job Description")}
                        className="mt-1 text-xs text-[#800080] hover:text-[#6a006a] font-medium transition-colors"
                      >
                        Read more
                      </button>
                    )}
                  </td>


                  {/* Nice to Have Skills */}
                  <td className="px-4 py-3 text-center" style={{ minWidth: "160px", maxWidth: "200px" }}>
                    <div className="flex flex-wrap justify-center gap-0 max-h-[44px] overflow-hidden">
                      {jobData?.mustHaveSkills?.filter(s => s.skillName.trim() !== "").map((skill, i) => (
                        <SkillPill key={i} name={skill.skillName} color="blue" />
                      ))}
                      {jobData?.mustHaveSkills?.filter(s => s.skillName.trim() !== "").length === 0 && "-"}
                    </div>
                    {jobData?.mustHaveSkills?.filter(s => s.skillName.trim() !== "").length > 1 && (
                      <button
                        onClick={() => handleJdShow(jobData.mustHaveSkills.filter(s => s.skillName.trim() !== "").map(s => s.skillName).join(", "), "Nice to Have Skills")}
                        className="mt-1 text-xs text-[#800080] hover:text-[#6a006a] font-medium transition-colors"
                      >
                        Read more
                      </button>
                    )}
                  </td>




                  {/* Mandatory Skills */}
                  <td className="px-4 py-3 text-center" style={{ minWidth: "160px", maxWidth: "200px" }}>
                    <div className="flex flex-wrap justify-center gap-0 max-h-[44px] overflow-hidden">
                      {jobData?.mandatorySkills?.filter(s => s.skillName.trim() !== "").map((skill, i) => (
                        <SkillPill key={i} name={skill.skillName} color="purple" />
                      ))}
                      {jobData?.mandatorySkills?.filter(s => s.skillName.trim() !== "").length === 0 && "-"}
                    </div>
                    {jobData?.mandatorySkills?.filter(s => s.skillName.trim() !== "").length > 2 && (
                      <button
                        onClick={() => handleJdShow(jobData.mandatorySkills.filter(s => s.skillName.trim() !== "").map(s => s.skillName).join(", "), "Mandatory Skills")}
                        className="mt-1 text-xs text-[#800080] hover:text-[#6a006a] font-medium transition-colors"
                      >
                        Read more
                      </button>
                    )}
                  </td>




                  {/* Experience */}
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                      {jobData.experience}
                    </span>
                  </td>

                  {/* Status Toggle */}
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={jobData.status === 1}
                          onChange={() => toggleStatus(jobData.id)}
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#800080] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#800080]"></div>
                      </label>
                      <span className={`text-xs font-medium ${jobData.status === 1 ? "text-emerald-600" : "text-gray-400"}`}>
                        {jobData.status === 1 ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>

                  {/* Date Added */}
                  <td className="px-4 py-3 text-center text-gray-500 text-xs whitespace-nowrap">
                    {new Date(jobData.createdAt).toISOString().split("T")[0]}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {/* View Candidates */}
                      <button
                        onClick={() => handleInvitation(jobData.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#800080] text-white hover:bg-[#800080] transition-colors duration-150 whitespace-nowrap shadow-sm"
                      >
                        View Candidates
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => handleEditModal(jobData.id)}
                        title="Edit Job"
                        className="flex items-center justify-center w-7 h-7 rounded-md text-[#800080] hover:bg-[#f9f0f9] hover:text-[#800080] transition-all duration-150"
                      >
                        <BsPencil className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteModal(jobData.id)}
                        title="Delete Job"
                        className="flex items-center justify-center w-7 h-7 rounded-md text-red-400 hover:bg-red-50 hover:text-red-600 transition-all duration-150"
                      >
                        <RiDeleteBin2Line className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Empty state */}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={HEADERS.length} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Search className="w-8 h-8 opacity-30" />
                      <p className="text-sm font-medium">No jobs found</p>
                      <p className="text-xs">Try adjusting your search query</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination total={filtered.length} page={page} onPage={setPage} />
      </div>

      {/* ── Modals ── */}
      {isModalOpen && (
        <AddJobsModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      )}
      {openEditModal && (
        <JobEditModal openEditModal={openEditModal} setOpenEditModal={setOpenEditModal} jobid={jobid} />
      )}
      {openDeleteModal && (
        <JobDeleteModal openDeleteModal={openDeleteModal} setOpenDeleteModal={setOpenDeleteModal} jobid={jobid} />
      )}
      {showJdModal && (
        <JdModalView showJdModal={showJdModal} setShowJdModal={setShowJdModal} showJd={showJd} title={modalTitle} />
      )}

    </div>
  )
}



// import { Plus, Upload, Calendar } from "lucide-react"
// import { Button } from "../components/ui/Button"
// import { Input } from "../components/ui/Input"
// import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table"
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/Dialog"
// import { useEffect, useState } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import { getJobs, getSingleJob, jobStatusToggle } from "../Reducer/JobSlice"
// import AddJobsModal from "./Modals/AddJobsModal"
// import { IoMdSend } from "react-icons/io";
// import InterviewModal from "./Modals/InterviewModal"
// import { ToastContainer } from "react-toastify"
// import { BsPencil } from "react-icons/bs";
// import { RiDeleteBin2Line } from "react-icons/ri";
// import JobEditModal from "./Modals/JobEditModal"
// import JobDeleteModal from "./Modals/JobDeleteModal"
// import { useNavigate } from "react-router"
// import JdModalView from "./Modals/JdModalView"
// export function Jobs() {
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const[inviteModalOpen,setInviteModalOpen]=useState(false)
//   const[openEditModal,setOpenEditModal]=useState(false)
//   const[openDeleteModal,setOpenDeleteModal]=useState(false)
//   const[jobid,setJobId]=useState()
//   const{allJobs}=useSelector((state)=>state?.jobs)
//   const dispatch=useDispatch()
//   const navigate=useNavigate()
//   const[showJdModal,setShowJdModal]=useState(false)
//   const[showJd,setShowJd]=useState("")
//   // const jobs = [
//   //   { id: 1, client: "Amazon", role: "Full-stack Engineer", date: "2023-10-25", candidates: 12 },
//   //   { id: 2, client: "Uber", role: "Backend Developer", date: "2023-10-24", candidates: 8 },
//   //   { id: 3, client: "Netflix", role: "Senior Frontend", date: "2023-10-22", candidates: 15 },
//   //   { id: 4, client: "Airbnb", role: "Product Designer", date: "2023-10-20", candidates: 5 },
//   // ]

//   useEffect(()=>{
//     dispatch(getJobs())
//   },[])

//   const handleInvitation=(id)=>{
//     // console.log("id",id);
    
//     // setJobId(id)
//     // setInviteModalOpen(true)
//     navigate("/candidate-list",{state:{id:id}})
//   }

//   const toggleStatus = (id) => {
//     console.log(id)
    
//     dispatch(jobStatusToggle({ id })).then((res) => {
//       if (res?.payload?.statusCode === 200) {
//         dispatch(getJobs())
//       }
//     })
//   }
//   const handleEditModal=(id)=>{
//     dispatch(getSingleJob({id:id}))
//     setJobId(id)
//     setOpenEditModal(true)
//   }
  
//   const handleDeleteModal=(id)=>{
//       setJobId(id)
//       setOpenDeleteModal(true)
//   }

//   const handleJdShow=(jd)=>{
//     setShowJdModal(true)
//     setShowJd(jd)
//   }
//   return (
//     <div className="space-y-6">
//       <ToastContainer/>
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <h2 className="text-2xl font-bold tracking-tight">Active Jobs</h2>
//               <Button
//               className="bg-[#800080] hover:bg-[#660066] text-white"
//               onClick={() => setIsModalOpen(true)}
//             >
//               <Plus className="mr-2 h-4 w-4" />
//               Add Job
//             </Button>
//             {
//               isModalOpen&&(
//                 <AddJobsModal
//                 isModalOpen={isModalOpen}
//                 setIsModalOpen={setIsModalOpen}
//                 />
//               )
//             }

//              {
//               openEditModal&&(
//                 <JobEditModal
//                 openEditModal={openEditModal}
//                 setOpenEditModal={setOpenEditModal}
//                 jobid={jobid}
//                 />
//               )
//             }
//               {
//               openDeleteModal&&(
//                 <JobDeleteModal
//                 openDeleteModal={openDeleteModal}
//                 setOpenDeleteModal={setOpenDeleteModal}
//                 jobid={jobid}
//                 />
//               )
//             }
//             {
//               showJdModal&&(
//                 <JdModalView
//                 showJdModal={showJdModal}
//                 setShowJdModal={setShowJdModal}
//                 showJd={showJd}
//                 />
//               )
//             }
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Job Listings</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Client Name</TableHead>
//                 <TableHead>Role</TableHead>
//                  <TableHead>Job Description</TableHead>
//                  <TableHead>Nice to have Skills</TableHead>
//                  <TableHead>Mandatory Skills</TableHead>
//                   <TableHead>Experience</TableHead>
//                   <TableHead>Status</TableHead>
//                 <TableHead style={{width:"100px"}}>Date Added</TableHead>
//                 <TableHead>Action</TableHead>
//                 <TableHead>&nbsp;</TableHead>
//                 <TableHead>&nbsp;</TableHead>
//                 {/* <TableHead className="text-right">Candidates</TableHead>
//                 <TableHead className="text-right">Actions</TableHead> */}
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {allJobs?.data?.map((jobData) => (
//                 <TableRow key={jobData.id}>
//                   <TableCell className="font-medium">{jobData.clientName}</TableCell>
//                   <TableCell>{jobData.role}</TableCell>
//                   <TableCell className="whitespace-pre-line max-w-[900px]">
//                     <div className={`overflow-hidden transition-all duration-300`}>
//                     <span>{jobData.jd.slice(0, 100)}...</span>
//                   <Button onClick={()=>{handleJdShow(jobData.jd)}} className="text-blue-950">read more</Button>  
//                     </div>
//                     </TableCell>
//                     <TableCell>{jobData?.mustHaveSkills?.map((skills)=>{
//                       return(
//                         <>
//                          {skills?.skillName}<br/>
//                         </>
//                       )
                     
//                     })}</TableCell>
//                      <TableCell>{jobData?.mandatorySkills?.map((skills)=>{
//                       return(
//                         <>
//                          {skills?.skillName}<br/>
//                         </>
//                       )
                     
//                     })}</TableCell>
//                     <TableCell>
//                       {jobData.experience}
//                     </TableCell>
//                     <TableCell className="whitespace-pre-line">

//                        <div className="flex items-center gap-2">
//                       <label className="relative inline-flex items-center cursor-pointer">
//                         <input 
//                           type="checkbox" 
//                           className="sr-only peer" 
//                           checked={jobData.status === 1}
//                            onChange={() => toggleStatus(jobData.id)}
//                         />
//                         <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#800080] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#800080]"></div>
//                         <span className="ml-2 text-sm text-gray-700"> {jobData.status === 1 ? "Active" : "Inactive"}</span>
//                       </label>
//                     </div>
//                     </TableCell>
//                   <TableCell> {new Date(jobData.createdAt).toISOString().split("T")[0]}</TableCell>
//                   <TableCell> 

//                     {/* <Button onClick={()=>handleInvitation(jobData.id)} className="bg-[#800080] text-white">
//                      Send invitation <IoMdSend /> 
//                     </Button> */}
//                       <Button onClick={()=>handleInvitation(jobData.id)} className="bg-[#800080] text-white">
//                      View Candidates
//                     </Button>
//                   </TableCell>
//                   <TableCell>
//                   <BsPencil onClick={()=>{handleEditModal(jobData.id)}} className="text-[#800080] text-[19px] cursor-pointer"/>
//                   </TableCell>
//                   <TableCell>
//                     <RiDeleteBin2Line onClick={()=>{handleDeleteModal(jobData.id)}} className="text-[#800080] text-[19px]  cursor-pointer"/>
//                   </TableCell>
               
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//       {/* {
//         inviteModalOpen&&(
//           <InterviewModal
//           inviteModalOpen={inviteModalOpen}
//           setInviteModalOpen={setInviteModalOpen}
//           jobid={jobid}
//           />
//         )
//       } */}
//     </div>
//   )
// }
