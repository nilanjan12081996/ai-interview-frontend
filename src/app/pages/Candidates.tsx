import { Search, Link as LinkIcon, Video, FileText, MessageSquare, Code, Download, MoreHorizontal, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState, useRef } from "react"
import { getCandidateData, reScheduleInterview, deleteCandidate } from "../Reducer/CandidateSlice"
import { IoMdEye } from "react-icons/io"
import LinkModal from "./Modals/LinkModal"
import CandidateEditModal from "./Modals/CandidateEditModal"
import { toast, ToastContainer } from "react-toastify"
import { MdDesktopAccessDisabled } from "react-icons/md"
import AccessDeniedModal from "./Modals/AccessDeniedModal"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/Dialog"
import { Button } from "flowbite-react"

const PAGE_SIZE = 10

// ─── Resend Modal ─────────────────────────────────────────────────────────────
function ResendModal({ open, setOpen, candidate }) {
  const dispatch = useDispatch()
  const [isCoding, setIsCoding] = useState(false)
  const [isInterview, setIsInterview] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleResend = async () => {
    setLoading(true)
    const res = await dispatch(
      reScheduleInterview({
        id: candidate.id,
        coding: isCoding ? 1 : 0,
        interviewData: isInterview ? 1 : 0,
      })
    )
    setLoading(false)
    if (res?.payload?.statusCode === 200) {
      toast.success(res?.payload?.message || "Link resent successfully!")
      setOpen(false)
    } else {
      toast.error(res?.payload?.message || "Failed to resend link.")
    }
  }

  const OptionCard = ({ label, description, icon: Icon, checked, onChange }) => (
    <div
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between border rounded-xl p-3.5 cursor-pointer transition-all duration-150 select-none ${
        checked
          ? "border-[#800080] bg-[#f9f0f9]"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${checked ? "bg-[#e9d0e9]" : "bg-gray-100"}`}>
          <Icon className={`w-4 h-4 ${checked ? "text-[#800080]" : "text-gray-400"}`} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">{label}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>

      {/* Toggle pill */}
      <div className={`w-9 h-5 rounded-full relative transition-colors duration-200 flex-shrink-0 ml-3 ${checked ? "bg-[#800080]" : "bg-gray-300"}`}>
        <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all duration-200 ${checked ? "left-[18px]" : "left-0.5"}`} />
      </div>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={(o) => !loading && setOpen(o)}>
      <DialogContent className="sm:max-w-[420px] bg-white fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <DialogHeader>
          <DialogTitle>Resend interview link</DialogTitle>
          <DialogDescription>
            Configure options before resending to{" "}
            <span className="font-medium text-gray-700">{candidate?.candidateName}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-4">
          <OptionCard
            label="Coding assessment"
            description="Enable coding round for this candidate"
            icon={Code}
            checked={isCoding}
            onChange={setIsCoding}
          />
          <OptionCard
            label="AI interview"
            description="Behavioral & technical questions"
            icon={MessageSquare}
            checked={isInterview}
            onChange={setIsInterview}
          />
        </div>

        {!isCoding && !isInterview && (
          <p className="text-xs text-red-500 -mt-2 mb-1">Please enable at least one option.</p>
        )}

        <DialogFooter className="flex justify-end gap-2">
          <Button color="light" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            className="bg-[#800080] hover:bg-[#660066]"
            onClick={handleResend}
            disabled={loading || (!isCoding && !isInterview)}
          >
            {loading ? "Sending..." : "Resend link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Action Dropdown ──────────────────────────────────────────────────────────
function ActionMenu({ onEdit, onDelete, isLast }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((prev) => !prev) }}
        className="flex items-center justify-center w-8 h-8 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-150"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {open && (
        <div
          className={`absolute right-0 z-50 w-36 rounded-lg border border-gray-100 bg-white shadow-lg overflow-hidden ${
            isLast ? "bottom-full mb-1" : "top-full mt-1"
          }`}
          style={{ animation: isLast ? "fadeSlideUp 0.15s ease" : "fadeSlideIn 0.15s ease" }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(false); onEdit?.() }}
            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:bg-[#f9f0f9] hover:text-[#800080] transition-colors duration-100"
          >
            <Pencil className="w-3.5 h-3.5" /> Edit
          </button>
          <div className="mx-3 border-t border-gray-100" />
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(false); onDelete?.() }}
            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-100"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

// ─── Status Pill ──────────────────────────────────────────────────────────────
function StatusPill({ status }) {
  const map = {
    Completed:  { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
    Scheduled:  { bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-500"    },
    Rejected:   { bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-500"     },
    Incomplete: { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500"   },
  }
  const s = map[status] ?? { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  )
}

// ─── Icon Button ──────────────────────────────────────────────────────────────
function IconBtn({ onClick, title, color = "text-gray-500", children }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`flex items-center justify-center w-7 h-7 rounded-md ${color} hover:bg-gray-100 transition-all duration-150 hover:scale-110`}
    >
      {children}
    </button>
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
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
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
export function Candidates() {
  const { candidatesList } = useSelector((state) => state?.candidate)
  const [shareLink, setShareLink] = useState(null)
  const [open, setOpen] = useState(false)
  const [accessDeniedModal, setAccessDeniedModal] = useState(false)
  const [causeData, setCauseData] = useState()
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  // Edit modal states
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState(null)

  // Resend modal states
  const [resendModalOpen, setResendModalOpen] = useState(false)
  const [resendCandidate, setResendCandidate] = useState(null)

  const baseUrl = "https://api.interviewfold.com"
  const dispatch = useDispatch()

  useEffect(() => { dispatch(getCandidateData()) }, [])

  const handleOpenAccessDenied = (data) => {
    setAccessDeniedModal(true)
    setCauseData(data)
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      dispatch(deleteCandidate({ id })).then((res) => {
        if (res?.payload?.statusCode === 200 || res?.payload?.status) {
          toast.success("Candidate deleted successfully!")
          dispatch(getCandidateData())
        } else {
          toast.error(res?.payload || "Failed to delete candidate")
        }
      })
    }
  }

  const openEditModal = (candidate) => {
    setSelectedCandidate(candidate)
    setEditModalOpen(true)
  }

  const openResendModal = (candidate) => {
    setResendCandidate(candidate)
    setResendModalOpen(true)
  }

  const allData = [...(candidatesList?.data ?? [])].reverse()
  const filtered = allData.filter((c) =>
    !search || c.candidateName?.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => { setPage(1) }, [search])

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const HEADERS = [
    "Candidate", "Email", "Phone", "Resume",
    "Client Name", "Interview Date", "Timing",
    "Interview Status", "Resources", "Report",
    "Resend Link", "Actions",
  ]

  return (
    <div className="space-y-5 p-1">
      <ToastContainer />

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Candidates</h2>
          <p className="text-sm text-gray-400 mt-0.5">{filtered.length} total records</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidates..."
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-[#cc66cc] focus:border-[#800080] bg-white shadow-sm transition"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {HEADERS.map((h) => (
                  <th key={h} className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {paginated.map((candidate, idx) => {
                const isLastElements = idx >= paginated.length - 2 && paginated.length > 2

                return (
                  <tr key={candidate.id} className="hover:bg-[#f9f0f9]/40 transition-colors duration-100">

                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <span className="font-medium text-gray-800 text-sm">{candidate.candidateName}</span>
                    </td>

                    <td className="px-4 py-3 text-center text-gray-500 text-xs whitespace-nowrap">{candidate.candidateEmail}</td>

                    <td className="px-4 py-3 text-center text-gray-500 text-xs whitespace-nowrap">{candidate.candidatePhone}</td>

                    {/* Resume */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <IconBtn
                          title="Download Resume"
                          color="text-[#800080]"
                          onClick={async () => {
                            try {
                              const fileUrl = `${baseUrl}/${candidate.resumeLink}`
                              const response = await fetch(fileUrl)
                              const blob = await response.blob()
                              const url = window.URL.createObjectURL(blob)
                              const link = document.createElement("a")
                              link.href = url
                              link.download = candidate.resumeLink.split("/").pop()
                              document.body.appendChild(link)
                              link.click()
                              document.body.removeChild(link)
                              window.URL.revokeObjectURL(url)
                            } catch { console.error("Download failed") }
                          }}
                        >
                          <Download className="w-3.5 h-3.5" />
                        </IconBtn>
                        <IconBtn
                          title="View Resume"
                          color="text-[#800080]"
                          onClick={() => window.open(`${baseUrl}/${candidate.resumeLink}`, "_blank")}
                        >
                          <IoMdEye className="w-3.5 h-3.5" />
                        </IconBtn>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-center text-gray-700 text-sm whitespace-nowrap">{candidate.jobName}</td>

                    <td className="px-4 py-3 text-center text-gray-700 text-sm whitespace-nowrap">{candidate.interviewDate}</td>

                    <td className="px-4 py-3 text-center text-gray-500 text-xs whitespace-nowrap">
                      {candidate.startTime} – {candidate.endTime}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <StatusPill status={candidate.is_complete === 1 ? "Completed" : "Incomplete"} />
                      </div>
                    </td>

                    {/* Resources */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-0.5">
                        <IconBtn title="Interview Link" color="text-blue-500"
                          onClick={() => { setShareLink(candidate.interviewLink); setOpen(true) }}>
                          <LinkIcon className="w-3.5 h-3.5" />
                        </IconBtn>
                        <IconBtn title="Recording" color="text-red-500"
                          onClick={() => {
                            if (candidate.videoLink) { setShareLink(candidate.videoLink); setOpen(true) }
                            else alert("Recording not available yet")
                          }}>
                          <Video className="w-3.5 h-3.5" />
                        </IconBtn>
                        <IconBtn title="Transcription" color="text-gray-500"
                          onClick={() => window.open(`${baseUrl}${candidate.transcription}`, "_blank")}>
                          <FileText className="w-3.5 h-3.5" />
                        </IconBtn>
                        <IconBtn title="Feedback" color="text-green-500">
                          <MessageSquare className="w-3.5 h-3.5" />
                        </IconBtn>
                        <IconBtn title="Coding Assessment" color="text-[#800080]">
                          <Code className="w-3.5 h-3.5" />
                        </IconBtn>
                        <IconBtn title="Access Denied Info" color="text-[#800080]"
                          onClick={() => handleOpenAccessDenied(candidate)}>
                          <MdDesktopAccessDisabled className="w-3.5 h-3.5" />
                        </IconBtn>
                      </div>
                    </td>

                    {/* Report */}
                    <td className="px-4 py-3 text-center">
                      {candidate.analysis ? (
                        <button
                          onClick={() => window.open(`${baseUrl}${candidate.analysis}`, "_blank")}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#800080] text-white hover:bg-[#660066] transition-colors duration-150 whitespace-nowrap shadow-sm"
                        >
                          View Report
                        </button>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>

                    {/* Resend Link — now opens modal */}
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => openResendModal(candidate)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#800080] text-white hover:bg-[#660066] transition-colors duration-150 whitespace-nowrap shadow-sm"
                      >
                        Resend
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <ActionMenu
                          isLast={isLastElements}
                          onEdit={() => openEditModal(candidate)}
                          onDelete={() => handleDelete(candidate.id)}
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}

              {paginated.length === 0 && (
                <tr>
                  <td colSpan={HEADERS.length} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Search className="w-8 h-8 opacity-30" />
                      <p className="text-sm font-medium">No candidates found</p>
                      <p className="text-xs">Try adjusting your search query</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination total={filtered.length} page={page} onPage={setPage} />
      </div>

      {/* Modals */}
      {open && <LinkModal open={open} setOpen={setOpen} shareLink={shareLink} />}

      {accessDeniedModal && (
        <AccessDeniedModal
          accessDeniedModal={accessDeniedModal}
          setAccessDeniedModal={setAccessDeniedModal}
          causeData={causeData}
        />
      )}

      <CandidateEditModal
        open={editModalOpen}
        setOpen={setEditModalOpen}
        candidate={selectedCandidate}
        jobid={selectedCandidate?.jobId || selectedCandidate?.job_id || selectedCandidate?.id}
        onSuccess={() => dispatch(getCandidateData())}
      />

      {/* Resend Modal */}
      {resendCandidate && (
        <ResendModal
          open={resendModalOpen}
          setOpen={setResendModalOpen}
          candidate={resendCandidate}
        />
      )}
    </div>
  )
}


// import { Search, Link as LinkIcon, Video, FileText, MessageSquare, Code, Download, MoreHorizontal } from "lucide-react"
// import { Button } from "../components/ui/Button"
// import { Input } from "../components/ui/Input"
// import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
// import { Badge } from "../components/ui/Badge"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table"
// import { useDispatch, useSelector } from "react-redux"
// import { useEffect, useState } from "react"
// import { getCandidateData, reScheduleInterview } from "../Reducer/CandidateSlice"
// import { IoMdEye } from "react-icons/io"
// import LinkModal from "./Modals/LinkModal"
// import { toast, ToastContainer } from "react-toastify"
// import { MdDesktopAccessDisabled } from "react-icons/md"
// import AccessDeniedModal from "./Modals/AccessDeniedModal"

// const candidates = [
//   {
//     id: 1,
//     name: "Sarah Connor",
//     email: "sarah@example.com",
//     phone: "+1 (555) 123-4567",
//     resume: "resume.pdf",
//     dateAdded: "2023-10-24",
//     interviewDate: "2023-10-26",
//     recruiter: "Kyle Reese",
//     status: "Scheduled",
//   },
//   {
//     id: 2,
//     name: "John Wick",
//     email: "john@example.com",
//     phone: "+1 (555) 987-6543",
//     resume: "resume_final.pdf",
//     dateAdded: "2023-10-23",
//     interviewDate: "2023-10-25",
//     recruiter: "Winston",
//     status: "Completed",
//   },
//   {
//     id: 3,
//     name: "Ellen Ripley",
//     email: "ellen@example.com",
//     phone: "+1 (555) 456-7890",
//     resume: "cv.pdf",
//     dateAdded: "2023-10-22",
//     interviewDate: "2023-10-24",
//     recruiter: "Burke",
//     status: "Rejected",
//   },
// ]

// export function Candidates() {
//   const{candidatesList}=useSelector((state)=>state?.candidate)
//   const [shareLink, setShareLink] = useState(null);
//   const [open, setOpen] = useState(false);
//   const[accessDeniedModal,setAccessDeniedModal]=useState(false)
//   const[causeData,setCauseData]=useState()
//   //const baseUrl="http://localhost:8085"
// const baseUrl="https://api.interviewfold.com"
//   const dispatch=useDispatch()
//   useEffect(()=>{
//     dispatch(getCandidateData())
//   },[])

//   const handleRescheduleInterview=(id)=>{
//     dispatch(reScheduleInterview({id:id})).then((res)=>{
//       if(res?.payload?.statusCode===200){
//         toast.success(res?.payload?.message)
//       }
//     })
//   }

// // const handleDownload = async (fileUrl) => {
// //   if (!fileUrl) {
// //     alert("No transcription available");
// //     return;
// //   }

// //   try {
// //     const response = await fetch(`${baseUrl}${fileUrl}`);

// //     if (!response.ok) {
// //       throw new Error("File download failed");
// //     }

// //     const blob = await response.blob();

// //     const downloadUrl = window.URL.createObjectURL(blob);

// //     const link = document.createElement("a");
// //     link.href = downloadUrl;
// //     link.download = "Interview_Transcript.txt"; // file name
// //     document.body.appendChild(link);
// //     link.click();

// //     link.remove();
// //     window.URL.revokeObjectURL(downloadUrl);

// //   } catch (error) {
// //     console.error("Download error:", error);
// //     alert("Failed to download transcription");
// //   }
// // };
  
// const handleViewInNewTab = async (fileUrl) => {
//   if (!fileUrl) {
//     alert("No transcription available");
//     return;
//   }

//   try {
//     const response = await fetch(`${baseUrl}${fileUrl}`);

//     if (!response.ok) {
//       throw new Error("File fetch failed");
//     }

//     const blob = await response.blob();

//     // 1. Create a new Blob with an explicit MIME type (e.g., text/plain)
//     // This ensures the browser tries to display it instead of downloading it.
//     const viewableBlob = new Blob([blob], { type: "text/plain" });

//     // 2. Create the URL
//     const viewUrl = window.URL.createObjectURL(viewableBlob);

//     // 3. Open in a new tab
//     window.open(viewUrl, "_blank");

//     // Note: We don't revoke the URL immediately because the new tab 
//     // needs time to load it. The browser will clean it up when the 
//     // current session ends, or you can manage it with a timeout.
//   } catch (error) {
//     console.error("View error:", error);
//     alert("Failed to open transcription");
//   }
// };

// const handleOpenAccessDenied=(data)=>{
// setAccessDeniedModal(true)
// setCauseData(data)
// }

// return (
//     <div className="space-y-6">
//       <ToastContainer/>
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <h2 className="text-2xl font-bold tracking-tight">Candidates</h2>
//         <div className="relative">
//           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
//           <Input
//             placeholder="Search candidates..."
//             className="w-full pl-9 sm:w-[300px]"
//           />
//         </div>
//       </div>

//       <Card>
//         <CardContent className="p-0">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Candidate</TableHead>
//                 <TableHead>Email</TableHead>
//                 <TableHead>Phone</TableHead>
//                 <TableHead>Resume</TableHead>
//                 {/* <TableHead>Date Added</TableHead> */}
//                 <TableHead>Client Name</TableHead>
//                 <TableHead style={{width:"250px", textAlign:"center"}}>Interview Date</TableHead>
//                 <TableHead>Interview Timing</TableHead>
//                  <TableHead>Interview Status</TableHead>
//                 <TableHead>Resources</TableHead>
//                  <TableHead>Report</TableHead>
//                 <TableHead>Resend Link</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {candidatesList?.data?.map((candidate) => (
//                 <TableRow key={candidate.id}>
//                   <TableCell>
//                     <div className="font-medium">{candidate.candidateName}</div>
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex flex-col text-xs text-gray-500">
//                       <span>{candidate.candidateEmail}</span>
                    
//                     </div>
//                   </TableCell>
//                    <TableCell>
//                     <div className="flex flex-col text-xs text-gray-500">
             
//                       <span>{candidate.candidatePhone}</span>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="h-8 w-8 text-[#800080]"
//                     onClick={async () => {
//                       try {
//                         const fileUrl = `${baseUrl}/${candidate.resumeLink}`;
                        
//                         const response = await fetch(fileUrl);
//                         const blob = await response.blob();

//                         const url = window.URL.createObjectURL(blob);
//                         const link = document.createElement("a");
//                         link.href = url;
//                         link.download = candidate.resumeLink.split("/").pop();
//                         document.body.appendChild(link);
//                         link.click();
//                         document.body.removeChild(link);

//                         window.URL.revokeObjectURL(url);
//                       } catch (error) {
//                         console.error("Download failed:", error);
//                       }
//                     }}
//                   >
//                     <Download className="h-4 w-4" />
//                   </Button>
//                    <Button
//                     variant="ghost"
//                     size="sm"
//                     className="h-8 w-8 text-[#800080]"
//                     onClick={() => {
//                                 const fileUrl = `${baseUrl}/${candidate.resumeLink}`;
//                                 window.open(fileUrl, "_blank");
//                             }}
//                   >
//                    <IoMdEye  className="h-4 w-4" />
//                   </Button>
//                   </div>
//                   </TableCell>
//                   <TableCell>{candidate.jobName}</TableCell>
//                   <TableCell >{candidate.interviewDate}</TableCell>
//                    <TableCell>{candidate.startTime}-{candidate.endTime}</TableCell>
//                      <TableCell>{candidate.is_complete===1?"Complete":"Incomplete"}</TableCell>
//                   <TableCell>
//                     <div className="flex items-center gap-1">
//                       {/* <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500" title="Interview Link"
//                        onClick={() => window.open(candidate.interviewLink, "_blank")}
//                       >
//                         <LinkIcon className="h-4 w-4" />
//                       </Button> */}
//                       {/* <Button 
//                        onClick={() => {
//                         if (candidate.videoLink) {
//                           window.open(candidate.videoLink, "_blank");
//                         } else {
//                           alert("Recording not available yet");
//                         }
//                       }}
//                       variant="ghost" size="icon" className="h-8 w-8 text-red-500" title="Recording">
//                         <Video className="h-4 w-4" />
//                       </Button> */}

//                         <Button
//                         variant="ghost"
//                         size="icon"
//                         className="h-8 w-8 text-blue-500"
//                         title="Interview Link"
//                         onClick={() => {
//                           setShareLink(candidate.interviewLink);
//                           setOpen(true);
//                         }}
//                       >
//                         <LinkIcon className="h-4 w-4" />
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="h-8 w-8 text-red-500"
//                         title="Recording"
//                         onClick={() => {
//                           if (candidate.videoLink) {
//                             setShareLink(candidate.videoLink);
//                             setOpen(true);
//                           } else {
//                             alert("Recording not available yet");
//                           }
//                         }}
//                       >
//                         <Video className="h-4 w-4" />
//                       </Button>
//                       <Button
//                       // onClick={() => handleDownload(candidate.transcription)}
//                       onClick={() => window.open(`${baseUrl}${candidate.transcription}`, '_blank')}
//                        variant="ghost" size="icon" className="h-8 w-8 text-gray-500" title="Transcription">
//                         <FileText className="h-4 w-4" />
//                       </Button>
//                       <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500" title="Feedback">
//                         <MessageSquare className="h-4 w-4" />
//                       </Button>
//                       <Button variant="ghost" size="icon" className="h-8 w-8 text-purple-500" title="Coding Assessment">
//                         <Code className="h-4 w-4" />
//                       </Button>
//                       <Button 
//                       onClick={()=>handleOpenAccessDenied(candidate)}
//                       variant="ghost" size="icon" className="h-8 w-8 text-purple-500" title="Coding Assessment">
//                       <MdDesktopAccessDisabled className="h-4 w-4" />
//                     </Button>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                    {candidate.analysis && (
//                     <Button
//                       className="bg-[#800080] text-white"
//                       onClick={() =>
//                         window.open(`${baseUrl}${candidate.analysis}`, "_blank")
//                       }
//                     >
//                       View Report
//                     </Button>
//                   )}
//                     </TableCell>
//                   <TableCell>
//                       <Button
//                       className="bg-[#800080] text-white"
//                       onClick={() =>
//                         handleRescheduleInterview(candidate.id)
//                       }
//                     >
//                       Resend
//                     </Button>
//                   </TableCell>
//                   <TableCell>
//                     <Badge variant={
//                       candidate.status === "Completed" ? "success" :
//                       candidate.status === "Rejected" ? "destructive" :
//                       "default"
//                     }>
//                       {candidate.status}
//                     </Badge>
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <Button variant="ghost" size="icon">
//                       <MoreHorizontal className="h-4 w-4" />
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//       {
//         open&&(
//           <LinkModal
//           open={open}
//           setOpen={setOpen}
//           shareLink={shareLink}
//           />
//         )
//       }
//        {
//                   accessDeniedModal&&(
//                     <AccessDeniedModal
//                     accessDeniedModal={accessDeniedModal}
//                     setAccessDeniedModal={setAccessDeniedModal}
//                     causeData={causeData}
//                     />
//                   )
                  
//                   }
//     </div>
//   )
// }
