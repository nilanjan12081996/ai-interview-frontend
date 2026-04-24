import { useState } from "react";
import { useDispatch } from "react-redux";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../components/ui/Dialog";
import { reScheduleInterview } from "../../Reducer/CandidateSlice";
import { toast } from "react-toastify";
import { Code, MessageSquare } from "lucide-react";
import { Button } from "flowbite-react";

const ResendModal = ({ open, setOpen, candidate }) => {
  const dispatch = useDispatch();
  const [isCoding, setIsCoding] = useState(false);
  const [isInterview, setIsInterview] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    const res = await dispatch(
      reScheduleInterview({
        id: candidate.id,
        coding: isCoding ? 1 : 0,
        interviewData: isInterview ? 1 : 0,
      })
    );
    setLoading(false);
    if (res?.payload?.statusCode === 200) {
      toast.success(res?.payload?.message || "Link resent successfully!");
      setOpen(false);
    } else {
      toast.error(res?.payload?.message || "Failed to resend link.");
    }
  };

  const OptionCard = ({ id, label, description, icon: Icon, checked, onChange }) => (
    <div
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between border rounded-xl p-3.5 cursor-pointer transition-all duration-150 select-none ${
        checked
          ? "border-[#800080] bg-[#f9f0f9]"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${checked ? "bg-[#e9d0e9]" : "bg-gray-100"}`}>
          <Icon className={`w-4 h-4 ${checked ? "text-[#800080]" : "text-gray-400"}`} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">{label}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>

      {/* Toggle */}
      <div
        className={`w-9 h-5 rounded-full relative transition-colors duration-200 flex-shrink-0 ${
          checked ? "bg-[#800080]" : "bg-gray-300"
        }`}
      >
        <div
          className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all duration-200 ${
            checked ? "left-[18px]" : "left-0.5"
          }`}
        />
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={(o) => !loading && setOpen(o)}>
      <DialogContent className="sm:max-w-[420px] bg-white fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <DialogHeader>
          <DialogTitle>Resend interview link</DialogTitle>
          <DialogDescription>
            Configure the interview options before resending to{" "}
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

        <DialogFooter className="flex justify-end gap-2">
          <Button
            color="light"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
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