
import { Button, FileInput, TextInput, ToggleSwitch } from "flowbite-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/Dialog"
import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { scheduleInterview, generateCodingQuestions } from "../../Reducer/CandidateSlice";
import { toast } from "react-toastify";
import { useState } from "react";
import { HiUpload, HiDocumentText } from "react-icons/hi";
import { getCandidateByJob } from "../../Reducer/JobSlice";
const InterviewModal=({
    inviteModalOpen,
    setInviteModalOpen,
    jobid
})=>{
const dispatch=useDispatch()
const {loading}=useSelector((state)=>state?.candidate)
const [selectedFile, setSelectedFile] = useState(null);
const [isCoding, setIsCoding] = useState(false);
const [isProcessing, setIsProcessing] = useState(false);
const [statusMessage, setStatusMessage] = useState("");

          const {
            register,
            watch,
            handleSubmit,
            setValue,
            formState: { errors },
          } = useForm();

          const onSubmit = async (data) => {
            setIsProcessing(true);
            setStatusMessage("Scheduling interview and preparing invite...");
            const formData = new FormData();
            formData.append("jobId", jobid); // pass job id from parent
            formData.append("candidateName", data.candidateName);
            formData.append("email", data.email);
            formData.append("phoneNumber", data.phoneNumber);
            formData.append("resumeFile", data.resumeFile[0]); // file
            formData.append("isCoding", data.isCoding ? true : false);
            formData.append("startTime", data.startTime);
            formData.append("endTime", data.endTime);
            formData.append("interviewDate", data.interviewDate);

            try {
              const res = await dispatch(scheduleInterview(formData));
              if (res?.payload?.statusCode === 201) {
                if (data.isCoding) {
                  setStatusMessage("Preparing coding assessment questions... This might take a few moments.");
                  await dispatch(generateCodingQuestions({ token: res.payload.token }));
                }
                toast.success(res?.payload?.message || "Interview Scheduled Successfully.");
                setIsProcessing(false);
                setInviteModalOpen(false);
                dispatch(getCandidateByJob({ id: jobid }));
              } else {
                setIsProcessing(false);
                toast.error(res?.payload?.message || "Failed to schedule interview.");
              }
            } catch (err) {
              setIsProcessing(false);
              toast.error("An unexpected error occurred.");
            }
          };
    
    return(
        <>
              {/* <Dialog  open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
            <DialogContent className="sm:max-w-[500px] bg-white max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Schedule New Interview</DialogTitle>
              <DialogDescription>
                Add candidate details and configure the interview session.
              </DialogDescription>
            </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            
         
            <div className="grid gap-2">
              <label className="text-sm font-medium">Candidate Name</label>
              <TextInput
                {...register("candidateName", { required: true })}
                placeholder="John Doe"
              />
            </div>

          
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Email</label>
                <TextInput
                  type="email"
                  {...register("email", { required: true })}
                  placeholder="john@example.com"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Phone</label>
                <TextInput
                  type="tel"
                  {...register("phoneNumber", { required: true })}
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

        
            <div className="grid gap-2">
              <label className="text-sm font-medium">Resume</label>
              <div className="text-center">
              <FileInput  className="mx-auto h-8 w-8 text-gray-400"
                {...register("resumeFile", { required: true })}
                accept=".pdf"
              />
               <p className="mt-2 text-sm text-gray-500">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400">PDF, DOCX up to 10MB</p>
                    </div>
            </div>

          
            <div className="flex items-center justify-between border p-3 rounded-lg">
              <label className="text-sm font-medium">
                Coding Assessment
              </label>
              <input type="checkbox" {...register("isCoding")} />
            </div>

         
            <div className="grid gap-2">
              <label className="text-sm font-medium">Date</label>
              <input
                type="date"
                {...register("interviewDate", { required: true })}
                className="border rounded p-2"
              />
            </div>

            <div className="flex gap-3">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Start Time</label>
                <input
                  type="time"
                  {...register("startTime", { required: true })}
                  className="border rounded p-2"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">End Time</label>
                <input
                  type="time"
                  {...register("endTime")}
                  className="border rounded p-2"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="bg-[#800080] hover:bg-[#660066]"
            >
              Send Invitation
            </Button>
          </DialogFooter>
        </form>
            </DialogContent>
              </Dialog> */}

<Dialog open={inviteModalOpen} onOpenChange={(open) => !isProcessing && setInviteModalOpen(open)}>
  <DialogContent className="sm:max-w-[500px] bg-white max-h-[90vh] p-0 overflow-hidden flex flex-col fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <div className="relative flex-1 overflow-y-auto p-6 scroll-smooth">
      {isProcessing && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg">
          <div className="w-12 h-12 border-4 border-[#800080] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-bold text-[#800080] px-8 text-center animate-pulse">
            {statusMessage}
          </p>
        </div>
      )}
      <DialogHeader>
        <DialogTitle>Schedule New Interview</DialogTitle>
        <DialogDescription>
          Add candidate details and configure the interview session.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} id="interview-form">
        <div className="grid gap-4 py-4">

          {/* Candidate Name */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">Candidate Name</label>
            <TextInput
              {...register("candidateName", { required: true })}
              placeholder="John Doe"
            />
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Email</label>
              <TextInput
                type="email"
                {...register("email", { required: true })}
                placeholder="john@example.com"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Phone</label>
              <TextInput
                type="text"
                {...register("phoneNumber", { required: true })}
                placeholder="+91 9876543210"
              />
            </div>
          </div>

          {/* Resume Upload */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">Resume</label>

            <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-purple-500 transition-all bg-gray-50">

              {!selectedFile ? (
                <>
                  <HiUpload className="h-10 w-10 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600 font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PDF, DOCX up to 10MB
                  </p>
                </>
              ) : (
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm border">
                  <HiDocumentText className="h-6 w-6 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                    {selectedFile.name}
                  </span>
                </div>
              )}

              <FileInput
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept=".pdf,.doc,.docx"
                {...register("resumeFile", {
                  required: true,
                  onChange: (e) => {
                    const file = e.target.files[0];
                    setSelectedFile(file);
                  },
                })}
              />
            </div>
          </div>

          <div className="flex items-center justify-between border p-4 rounded-xl bg-gray-50">
            <div>
              <p className="text-sm font-medium">Coding Assessment</p>
              <p className="text-xs text-gray-500">
                Enable coding round for this interview
              </p>
            </div>

            <ToggleSwitch
              checked={isCoding}
              label=""
              color="purple"
              onChange={(checked) => {
                setIsCoding(checked);
                setValue("isCoding", checked);
              }}
            />
          </div>

          {/* Date */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">Interview Date</label>
            <input
              type="date"
              {...register("interviewDate", { required: true })}
              className="border rounded p-2"
            />
          </div>

          {/* Time */}
          <div className="flex gap-3">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Start Time</label>
              <input
                type="time"
                {...register("startTime", { required: true })}
                className="border rounded p-2"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">End Time</label>
              <input
                type="time"
                {...register("endTime")}
                className="border rounded p-2"
              />
            </div>
          </div>

        </div>
      </form>
    </div>
    <DialogFooter className="flex justify-end p-6 pt-0">
      <Button
        type="submit"
        className="bg-[#800080] hover:bg-[#660066]"
        form="interview-form"
        disabled={isProcessing}
      >
        {isProcessing ? (loading ? "Sending..." : "Preparing...") : (loading ? "Waiting..." : "Send Invitation")}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

        </>
    )
}
export default InterviewModal