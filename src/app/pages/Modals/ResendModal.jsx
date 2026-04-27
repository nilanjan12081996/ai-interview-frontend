import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../components/ui/Dialog";
import { reScheduleInterview, updateCandidate } from "../../Reducer/CandidateSlice";
import { toast } from "react-toastify";
import { Code, MessageSquare } from "lucide-react";
import { Button } from "flowbite-react";

const ResendModal = ({ open, setOpen, candidate, jobId }) => {
  const dispatch = useDispatch();
  const [isCoding, setIsCoding] = useState(candidate?.isCoding === 1);
  const [isInterview, setIsInterview] = useState(true);
  const [loading, setLoading] = useState(false);

  // Date and Time state
  const [interviewDate, setInterviewDate] = useState(candidate?.interviewDate || "");
  const [startTime, setStartTime] = useState(candidate?.startTime || "");
  const [endTime, setEndTime] = useState(candidate?.endTime || "");

  useEffect(() => {
    if (candidate && open) {
      setIsCoding(candidate.isCoding === 1);
      setInterviewDate(candidate.interviewDate || "");
      setStartTime(candidate.startTime || "");
      setEndTime(candidate.endTime || "");
    }
  }, [candidate, open]);

  const handleResend = async () => {
    setLoading(true);
    try {
      // 1. Update candidate schedule first
      const updatePayload = {
        candidateName: candidate.candidateName,
        email: candidate.candidateEmail,
        phoneNumber: candidate.candidatePhone,
        jobId: jobId || candidate.jobId || candidate.job_id,
        startTime,
        endTime,
        interviewDate,
        resumeLink: candidate.resumeLink,
        isCoding: isCoding ? true : false,
      };

      const updateRes = await dispatch(updateCandidate({ id: candidate.id, userInput: updatePayload }));

      if (updateRes?.payload?.statusCode === 200 || updateRes?.payload?.status) {
        // 2. Then call resend link API
        const res = await dispatch(
          reScheduleInterview({
            id: candidate.id,
            coding: isCoding ? 1 : 0,
            interviewData: isInterview ? 1 : 0,
          })
        );

        if (res?.payload?.statusCode === 200 || res?.payload?.status) {
          toast.success(res?.payload?.message || "Link resent successfully!");
          setOpen(false);
        } else {
          toast.error(res?.payload?.message || "Failed to resend link.");
        }
      } else {
        toast.error(updateRes?.payload?.message || "Failed to update schedule.");
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

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
  );

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

        <div className="flex flex-col gap-4 py-4">
          {/* Options */}
          <div className="flex flex-col gap-3">
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

          {/* Date & Time Inputs */}
          <div className="grid gap-3 pt-2 border-t border-gray-100">
            <div className="grid gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Interview Date</label>
              <input
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#cc66cc] focus:border-[#800080] outline-none transition"
                onClick={(e) => e.target.showPicker && e.target.showPicker()}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#cc66cc] focus:border-[#800080] outline-none transition"
                  onClick={(e) => e.target.showPicker && e.target.showPicker()}
                />
              </div>
              <div className="grid gap-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#cc66cc] focus:border-[#800080] outline-none transition"
                  onClick={(e) => e.target.showPicker && e.target.showPicker()}
                />
              </div>
            </div>
          </div>
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
  );
};

export default ResendModal;