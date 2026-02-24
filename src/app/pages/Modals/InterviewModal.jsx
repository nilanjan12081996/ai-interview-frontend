
import { Button, FileInput, TextInput, ToggleSwitch } from "flowbite-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/Dialog"
import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { scheduleInterview } from "../../Reducer/CandidateSlice";
import { toast } from "react-toastify";
import { useState } from "react";
import { HiUpload, HiDocumentText } from "react-icons/hi";
const InterviewModal=({
    inviteModalOpen,
    setInviteModalOpen,
    jobid
})=>{
const dispatch=useDispatch()
const [selectedFile, setSelectedFile] = useState(null);
const [isCoding, setIsCoding] = useState(false);

          const {
            register,
            watch,
            handleSubmit,
            setValue,
            formState: { errors },
          } = useForm();

          const onSubmit=(data)=>{
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
            dispatch(scheduleInterview(formData)).then((res)=>{
                console.log("res")
                if(res?.payload?.statusCode===201){
                    toast.success(res?.payload?.message)
                    setInviteModalOpen(false)
                }
                
            })
            
          }
    
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

<Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
  <DialogContent className="sm:max-w-[500px] bg-white max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Schedule New Interview</DialogTitle>
      <DialogDescription>
        Add candidate details and configure the interview session.
      </DialogDescription>
    </DialogHeader>

    <form onSubmit={handleSubmit(onSubmit)}>
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

        {/* Coding Switch */}
        {/* <div className="flex items-center justify-between border p-3 rounded-lg">
          <label className="text-sm font-medium">
            Coding Assessment
          </label>
          <input type="checkbox" {...register("isCoding")} />
        </div> */}

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
</Dialog>

        </>
    )
}
export default InterviewModal