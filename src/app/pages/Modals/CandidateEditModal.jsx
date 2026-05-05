import { Button, TextInput, ToggleSwitch } from "flowbite-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/Dialog"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { updateCandidate } from "../../Reducer/CandidateSlice"
import { toast } from "react-toastify"
import { useState, useEffect } from "react"

const CandidateEditModal = ({
  open,
  setOpen,
  candidate,
  jobid,
  onSuccess
}) => {
  const dispatch = useDispatch()
  const [isProcessing, setIsProcessing] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm()

  const isCoding = watch("isCoding")
  const isInterview = watch("isInterview")

  useEffect(() => {
    if (candidate && open) {
      // API labels are candidateName, candidateEmail, candidatePhone
      reset({
        candidateName: candidate.candidateName || "",
        email: candidate.candidateEmail || "",
        phoneNumber: candidate.candidatePhone || "",
        interviewDate: candidate.interviewDate || "",
        startTime: candidate.startTime || "",
        endTime: candidate.endTime || "",
        isCoding: candidate.isCoding === 1 || candidate.isCoding === true,
        isInterview: candidate.isInterview === 1 || candidate.isInterview === true || candidate.isInterview === undefined // Default to true if undefined
      })
    } else if (!open) {
      reset()
    }
  }, [candidate, open, reset])

  const onSubmit = async (data) => {
    setIsProcessing(true)
    try {
      const finalJobId = jobid || candidate?.jobId || candidate?.job_id || candidate?.id;

      if (!finalJobId) {
        toast.error("Job ID not found for this candidate.");
        setIsProcessing(false);
        return;
      }

      const payloadData = {
        candidateName: data.candidateName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        jobId: finalJobId,
        startTime: data.startTime || "00:00:00",
        resumeLink: candidate?.resumeLink || "N/A",
        isCoding: data.isCoding ? true : false,
        isInterview: data.isInterview ? true : false,
        endTime: data.endTime || "00:00:00",
        interviewDate: data.interviewDate || ""
      }

      const res = await dispatch(updateCandidate({ id: candidate.id, userInput: payloadData }))

      if (res?.payload?.statusCode === 200 || res?.payload?.status) {
        toast.success("Candidate updated successfully.")
        setOpen(false)
        if (onSuccess) onSuccess();
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
      <DialogContent className="sm:max-w-[500px] bg-white p-0 overflow-hidden flex flex-col fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-2xl z-[100] max-h-[95vh]">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full overflow-hidden">
          <div className="relative flex-1 overflow-y-auto p-6 scroll-smooth shadow-inner">
            <DialogHeader className="mb-6 text-center">
              <DialogTitle className="text-2xl font-bold text-gray-900">Edit Candidate</DialogTitle>
              <DialogDescription className="text-gray-500">
                Update details and schedule for <span className="font-semibold text-purple-700">{candidate?.candidateName}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6">
              {/* Name */}
              <div className="grid gap-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-tight">Candidate Name</label>
                <TextInput
                  {...register("candidateName", { required: "Name is required" })}
                  placeholder="e.g. John Doe"
                  className="rounded-lg shadow-sm"
                />
              </div>

              {/* Email + Phone Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-tight">Email</label>
                  <TextInput
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    placeholder="john@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-tight">Phone</label>
                  <TextInput
                    type="text"
                    {...register("phoneNumber", { required: "Phone is required" })}
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              {/* Toggles Group */}
              <div className="grid gap-3">
                <div className="flex items-center justify-between border p-4 rounded-xl bg-gray-50/50 border-gray-100">
                  <div>
                    <p className="text-sm font-bold text-gray-800">Coding Assessment</p>
                    <p className="text-xs text-gray-500">Enable coding round</p>
                  </div>
                  <ToggleSwitch
                    checked={!!isCoding}
                    label=""
                    color="purple"
                    onChange={(checked) => setValue("isCoding", checked)}
                  />
                </div>

                <div className="flex items-center justify-between border p-4 rounded-xl bg-gray-50/50 border-gray-100">
                  <div>
                    <p className="text-sm font-bold text-gray-800">AI Interview</p>
                    <p className="text-xs text-gray-500">Enable behavioral questions</p>
                  </div>
                  <ToggleSwitch
                    checked={!!isInterview}
                    label=""
                    color="purple"
                    onChange={(checked) => setValue("isInterview", checked)}
                  />
                </div>
              </div>

              {/* Date */}
              <div className="grid gap-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-tight">Interview Date</label>
                <input
                  type="date"
                  {...register("interviewDate", { required: "Date is required" })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#cc66cc] focus:border-[#800080] outline-none transition cursor-pointer bg-white"
                  onClick={(e) => e.target.showPicker && e.target.showPicker()}
                />
              </div>

              {/* Times Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-tight">Start Time</label>
                  <input
                    type="time"
                    {...register("startTime", { required: "Start time is required" })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#cc66cc] focus:border-[#800080] outline-none transition cursor-pointer bg-white"
                    onClick={(e) => e.target.showPicker && e.target.showPicker()}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-tight">End Time</label>
                  <input
                    type="time"
                    {...register("endTime", { required: "End time is required" })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#cc66cc] focus:border-[#800080] outline-none transition cursor-pointer bg-white"
                    onClick={(e) => e.target.showPicker && e.target.showPicker()}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-end p-6 bg-white items-center gap-3 border-t border-gray-100">
            <Button
              type="button"
              color="light"
              onClick={() => setOpen(false)}
              disabled={isProcessing}
              className="text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 rounded-lg px-5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#800080] hover:bg-[#660066] text-white px-8 rounded-lg shadow-lg"
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