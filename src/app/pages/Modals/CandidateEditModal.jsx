import { Button, TextInput } from "flowbite-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/Dialog"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { updateCandidate } from "../../Reducer/CandidateSlice"
// import { getCandidateByJob } from "../../Reducer/JobSlice" <-- Eta ekhon r ekhane lagbe na
import { toast } from "react-toastify"
import { useState, useEffect } from "react"

const CandidateEditModal = ({
  open,
  setOpen,
  candidate,
  jobid,
  onSuccess // <-- 1. Ekhane onSuccess prop receive kora holo
}) => {
  const dispatch = useDispatch()
  const [isProcessing, setIsProcessing] = useState(false)
console.log('candidate',candidate)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  // Modal open hole eksathe form er default value gulo set kore dewa hocche
  useEffect(() => {
    if (candidate && open) {
      reset({
        candidateName: candidate.candidateName || "",
        email: candidate.candidateEmail || "",      // API expect korche 'email'
        phoneNumber: candidate.candidatePhone || "" // API expect korche 'phoneNumber'
      })
    } else if (!open) {
      reset()
    }
  }, [candidate, open, reset])

  const onSubmit = async (data) => {
    setIsProcessing(true)
    try {
      // jobid fallback setup
      const finalJobId = jobid || candidate?.jobId || candidate?.job_id || candidate?.id;

      if (!finalJobId) {
          toast.error("Job ID not found for this candidate.");
          setIsProcessing(false);
          return; 
      }

      const payloadData = {
        // Form theke asha data
        candidateName: data.candidateName,
        email: data.email, 
        phoneNumber: data.phoneNumber,
        
        // Hidden required data
        jobId: finalJobId, 
        startTime: candidate?.startTime || "00:00", 
        resumeLink: candidate?.resumeLink || "N/A", 
        isCoding: candidate?.isCoding !== undefined ? candidate.isCoding : false, 
        endTime: candidate?.endTime || "00:00",
        interviewDate: candidate?.interviewDate || ""
      }

      const res = await dispatch(updateCandidate({ id: candidate.id, userInput: payloadData }))
      
      if (res?.payload?.statusCode === 200 || res?.payload?.status) {
        toast.success("Candidate updated successfully.")
        setOpen(false)
        
        // <-- 2. Ekhane onSuccess call kora holo table auto-refresh korar jonno
        if (onSuccess) {
          onSuccess();
        }

      } else {
        toast.error(res?.payload?.message || "Failed to update candidate.")
      }
    } catch (err) {
      toast.error("An unexpected error occurred.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !isProcessing && setOpen(val)}>
      <DialogContent className="sm:max-w-[450px] bg-white p-0 overflow-hidden flex flex-col fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-2xl z-[100]">
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
          
          <div className="relative flex-1 overflow-y-auto p-6 scroll-smooth">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl font-semibold">Edit Candidate</DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                Update candidate details below.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              
              {/* Candidate Name */}
              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-700">Candidate Name</label>
                <TextInput
                  {...register("candidateName", { required: "Name is required" })}
                  placeholder="John Doe"
                  className={errors.candidateName ? "border-red-500" : ""}
                />
                {errors.candidateName && <span className="text-xs text-red-500">{errors.candidateName.message}</span>}
              </div>

              {/* Email */}
              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <TextInput
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  placeholder="john@example.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
              </div>

              {/* Phone Number */}
              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <TextInput
                  type="text"
                  {...register("phoneNumber", { required: "Phone number is required" })}
                  placeholder="+91 9876543210"
                  className={errors.phoneNumber ? "border-red-500" : ""}
                />
                {errors.phoneNumber && <span className="text-xs text-red-500">{errors.phoneNumber.message}</span>}
              </div>

            </div>
          </div>

          <DialogFooter className="flex justify-end p-6 pt-0 bg-gray-50/50 border-t border-gray-100 mt-auto">
            <Button
              type="button"
              color="light"
              onClick={() => setOpen(false)}
              disabled={isProcessing}
              className="mr-3 text-gray-600 bg-white border border-gray-200 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#800080] hover:bg-[#660066] text-white"
              disabled={isProcessing}
            >
              {isProcessing ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>

        </form>

      </DialogContent>
    </Dialog>
  )
}

export default CandidateEditModal