import { Search, Link as LinkIcon, Video, FileText, MessageSquare, Code, Download, MoreHorizontal } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Badge } from "../components/ui/Badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { getCandidateByJob } from "../Reducer/JobSlice"
import { useLocation } from "react-router"
import InterviewModal from "./Modals/InterviewModal"
import { IoMdEye } from "react-icons/io"
import LinkModal from "./Modals/LinkModal"
import { MdDesktopAccessDisabled } from "react-icons/md";
import { reScheduleInterview } from "../Reducer/CandidateSlice"
import { toast, ToastContainer } from "react-toastify"
import AccessDeniedModal from "./Modals/AccessDeniedModal"
const CandidateByJob=()=>{
  const baseUrl="http://localhost:8085";
  //const baseUrl="https://aiinterviewagent.bestworks.cloud";
    const{candidateByJobData}=useSelector((state)=>state?.jobs)
     const[inviteModalOpen,setInviteModalOpen]=useState(false)
      const [shareLink, setShareLink] = useState(null);
      const [open, setOpen] = useState(false);
      const[accessDeniedModal,setAccessDeniedModal]=useState(false)
      const[causeData,setCauseData]=useState()
    const location=useLocation()
    const id=location?.state?.id
    const dispatch=useDispatch()
    useEffect(()=>{
        dispatch(getCandidateByJob({id:id}))
    },[])
    console.log("candidateByJob",candidateByJobData);

    const handleAddStudent=()=>{
        setInviteModalOpen(true)

    }
    console.log("candidateByJobData",candidateByJobData)

//   const handleDownload = async (fileUrl) => {
//   if (!fileUrl) {
//     alert("No transcription available");
//     return;
//   }

//   try {
//     const response = await fetch(`${baseUrl}${fileUrl}`);

//     if (!response.ok) {
//       throw new Error("File download failed");
//     }

//     const blob = await response.blob();

//     const downloadUrl = window.URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.href = downloadUrl;
//     link.download = "Interview_Transcript.txt"; // file name
//     document.body.appendChild(link);
//     link.click();

//     link.remove();
//     window.URL.revokeObjectURL(downloadUrl);

//   } catch (error) {
//     console.error("Download error:", error);
//     alert("Failed to download transcription");
//   }
// };
    
 const handleRescheduleInterview=(id)=>{
    dispatch(reScheduleInterview({id:id})).then((res)=>{
      if(res?.payload?.statusCode===200){
        toast.success(res?.payload?.message)
      }
    })
  }
const handleViewInNewTab = async (fileUrl) => {
  if (!fileUrl) {
    alert("No transcription available");
    return;
  }

  try {
    const response = await fetch(`${baseUrl}${fileUrl}`);

    if (!response.ok) {
      throw new Error("File fetch failed");
    }

    const blob = await response.blob();

    // 1. Create a new Blob with an explicit MIME type (e.g., text/plain)
    // This ensures the browser tries to display it instead of downloading it.
    const viewableBlob = new Blob([blob], { type: "text/plain" });

    // 2. Create the URL
    const viewUrl = window.URL.createObjectURL(viewableBlob);

    // 3. Open in a new tab
    window.open(viewUrl, "_blank");

    // Note: We don't revoke the URL immediately because the new tab 
    // needs time to load it. The browser will clean it up when the 
    // current session ends, or you can manage it with a timeout.
  } catch (error) {
    console.error("View error:", error);
    alert("Failed to open transcription");
  }
};

const handleOpenAccessDenied=(data)=>{
setAccessDeniedModal(true)
setCauseData(data)
}


return(
        <>
        <div className="space-y-6">
          <ToastContainer/>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Candidates</h2>
                {/* <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search candidates..."
                    className="w-full pl-9 sm:w-[300px]"
                  />
                </div> */}
                <div>
                    <Button onClick={handleAddStudent}  className="bg-[#800080] text-white">Add Candidate</Button>
                </div>
              </div>
        
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Candidate</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Resume</TableHead>
                        {/* <TableHead>Date Added</TableHead> */}
                        <TableHead>Client Name</TableHead>
                        <TableHead>Interview Date</TableHead>
                        <TableHead>Interview Timing</TableHead>
                         <TableHead>Interview Status</TableHead>
                        <TableHead>Resources</TableHead>
                        <TableHead>Report</TableHead>
                        <TableHead>Resend Link</TableHead>
                        {/* <TableHead>Status</TableHead> */}
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {candidateByJobData?.data?.map((candidate) => (
                        <TableRow key={candidate.id}>
                          <TableCell>
                            <div className="font-medium">{candidate.candidateName}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col text-xs text-gray-500">
                              <span>{candidate.candidateEmail}</span>
                              
                            </div>
                          </TableCell>
                            <TableCell>
                            <div className="flex flex-col text-xs text-gray-500">
                              
                              <span>{candidate.candidatePhone}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 text-[#800080]"
                            
                            onClick={async () => {
                              try {
                                const fileUrl = `${baseUrl}/${candidate.resumeLink}`;
                                
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
                                const fileUrl = `${baseUrl}/${candidate.resumeLink}`;
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
                            <TableCell>{candidate.is_complete===1?"Complete":"Incomplete"}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {/* <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500" title="Interview Link"
                               onClick={() => window.open(candidate.interviewLink, "_blank")}
                              >
                                <LinkIcon className="h-4 w-4" />
                              </Button>
                              <Button 
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
                              <Button 
                              // onClick={() => handleDownload(candidate.transcription)}
                              onClick={() => window.open(`${baseUrl}${candidate.transcription}`, '_blank')}
                              variant="ghost" size="icon" className="h-8 w-8 text-gray-500" title="Transcription">
                                <FileText className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500" title="Feedback">
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-purple-500" title="Coding Assessment">
                                <Code className="h-4 w-4" />
                              </Button>
                                 <Button
                                 onClick={()=>handleOpenAccessDenied(candidate)}
                                  variant="ghost" size="icon" className="h-8 w-8 text-purple-500" title="Coding Assessment">
                                <MdDesktopAccessDisabled className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                            <TableCell>
                        {candidate.analysis && (
                          <Button
                            className="bg-[#800080] text-white"
                            onClick={() =>
                              window.open(`${baseUrl}${candidate.analysis}`, "_blank")
                            }
                          >
                            View Report
                          </Button>
                        )}
                    </TableCell>
                             <TableCell>
                      <Button
                      className="bg-[#800080] text-white"
                      onClick={() =>
                        handleRescheduleInterview(candidate.id)
                      }
                    >
                      Resend
                    </Button>
                  </TableCell>
                          {/* <TableCell>
                            <Badge variant={
                              candidate.status === "Completed" ? "success" :
                              candidate.status === "Rejected" ? "destructive" :
                              "default"
                            }>
                              {candidate.status}
                            </Badge>
                          </TableCell> */}
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
        inviteModalOpen&&(
          <InterviewModal
          inviteModalOpen={inviteModalOpen}
          setInviteModalOpen={setInviteModalOpen}
          jobid={id}
          />
        )
      }

      {
              open&&(
                <LinkModal
                open={open}
                setOpen={setOpen}
                shareLink={shareLink}
                />
              )
            }

            {
            accessDeniedModal&&(
              <AccessDeniedModal
              accessDeniedModal={accessDeniedModal}
              setAccessDeniedModal={setAccessDeniedModal}
              causeData={causeData}
              />
            )
            
            }
            </div>
        </>
    )
}
export default CandidateByJob;