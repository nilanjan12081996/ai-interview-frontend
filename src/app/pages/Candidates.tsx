
import { Search, Link as LinkIcon, Video, FileText, MessageSquare, Code, Download, MoreHorizontal } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Badge } from "../components/ui/Badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { getCandidateData } from "../Reducer/CandidateSlice"
import { IoMdEye } from "react-icons/io"
import LinkModal from "./Modals/LinkModal"
import { ToastContainer } from "react-toastify"

const candidates = [
  {
    id: 1,
    name: "Sarah Connor",
    email: "sarah@example.com",
    phone: "+1 (555) 123-4567",
    resume: "resume.pdf",
    dateAdded: "2023-10-24",
    interviewDate: "2023-10-26",
    recruiter: "Kyle Reese",
    status: "Scheduled",
  },
  {
    id: 2,
    name: "John Wick",
    email: "john@example.com",
    phone: "+1 (555) 987-6543",
    resume: "resume_final.pdf",
    dateAdded: "2023-10-23",
    interviewDate: "2023-10-25",
    recruiter: "Winston",
    status: "Completed",
  },
  {
    id: 3,
    name: "Ellen Ripley",
    email: "ellen@example.com",
    phone: "+1 (555) 456-7890",
    resume: "cv.pdf",
    dateAdded: "2023-10-22",
    interviewDate: "2023-10-24",
    recruiter: "Burke",
    status: "Rejected",
  },
]

export function Candidates() {
  const{candidatesList}=useSelector((state)=>state?.candidate)
  const [shareLink, setShareLink] = useState(null);
const [open, setOpen] = useState(false);
  const dispatch=useDispatch()
  useEffect(()=>{
    dispatch(getCandidateData())
  },[])
  return (
    <div className="space-y-6">
      <ToastContainer/>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Candidates</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search candidates..."
            className="w-full pl-9 sm:w-[300px]"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Resume</TableHead>
                {/* <TableHead>Date Added</TableHead> */}
                <TableHead>Client Name</TableHead>
                <TableHead>Interview Date</TableHead>
                <TableHead>Interview Timing</TableHead>
                <TableHead>Resources</TableHead>
                <TableHead>Recruiter</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidatesList?.data?.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell>
                    <div className="font-medium">{candidate.candidateName}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-xs text-gray-500">
                      <span>{candidate.candidateEmail}</span>
                      <span>{candidate.candidatePhone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 text-[#800080]"
                    onClick={async () => {
                      try {
                        const fileUrl = `https://aiinterviewagent.bestworks.cloud/${candidate.resumeLink}`;
                        
                        const response = await fetch(fileUrl);
                        const blob = await response.blob();

                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = candidate.resumeLink.split("/").pop();
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        window.URL.revokeObjectURL(url);
                      } catch (error) {
                        console.error("Download failed:", error);
                      }
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                   <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 text-[#800080]"
                    onClick={() => {
                                const fileUrl = `https://aiinterviewagent.bestworks.cloud/${candidate.resumeLink}`;
                                window.open(fileUrl, "_blank");
                            }}
                  >
                   <IoMdEye  className="h-4 w-4" />
                  </Button>
                  </div>
                  </TableCell>
                  <TableCell>{candidate.jobName}</TableCell>
                  <TableCell>{candidate.interviewDate}</TableCell>
                   <TableCell>{candidate.startTime}-{candidate.endTime}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {/* <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500" title="Interview Link"
                       onClick={() => window.open(candidate.interviewLink, "_blank")}
                      >
                        <LinkIcon className="h-4 w-4" />
                      </Button> */}
                      {/* <Button 
                       onClick={() => {
                        if (candidate.videoLink) {
                          window.open(candidate.videoLink, "_blank");
                        } else {
                          alert("Recording not available yet");
                        }
                      }}
                      variant="ghost" size="icon" className="h-8 w-8 text-red-500" title="Recording">
                        <Video className="h-4 w-4" />
                      </Button> */}

                        <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-500"
                        title="Interview Link"
                        onClick={() => {
                          setShareLink(candidate.interviewLink);
                          setOpen(true);
                        }}
                      >
                        <LinkIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        title="Recording"
                        onClick={() => {
                          if (candidate.videoLink) {
                            setShareLink(candidate.videoLink);
                            setOpen(true);
                          } else {
                            alert("Recording not available yet");
                          }
                        }}
                      >
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500" title="Transcription">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500" title="Feedback">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-purple-500" title="Coding Assessment">
                        <Code className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{candidate.recruiter}</TableCell>
                  <TableCell>
                    <Badge variant={
                      candidate.status === "Completed" ? "success" :
                      candidate.status === "Rejected" ? "destructive" :
                      "default"
                    }>
                      {candidate.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {
        open&&(
          <LinkModal
          open={open}
          setOpen={setOpen}
          shareLink={shareLink}
          />
        )
      }
    </div>
  )
}
