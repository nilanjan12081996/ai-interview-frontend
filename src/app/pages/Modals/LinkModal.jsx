

import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/Dialog";
import { Button } from "flowbite-react";
const LinkModal=({
    open,
    setOpen,
    shareLink
})=>{
    return(
        <>
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogContent className="bg-white">
                <DialogHeader>
                <DialogTitle>Share Link</DialogTitle>
                </DialogHeader>

                <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={shareLink || ""}
                    readOnly
                    className="flex-1 border rounded px-2 py-1 text-sm"
                />

                <Button
                className="bg-[#800080]"
                    onClick={() => {
                    navigator.clipboard.writeText(shareLink);
                    toast.success("Link copied!");
                    }}
                >
                    Copy
                </Button>
                </div>

                <div className="mt-4 text-right">
                <Button
                className="bg-[#800080]"
                    variant="outline"
                    onClick={() => window.open(shareLink, "_blank")}
                >
                    Open in New Tab
                </Button>
                </div>
            </DialogContent>
        </Dialog>
        </>
    )
}
export default LinkModal