import { Button, Textarea, TextInput } from "flowbite-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/Dialog"

const JdModalView=(
    {
        showJdModal,
        setShowJdModal,
        showJd,
        title = "Details"
    }
)=>{
    return(
        <>
         <Dialog  open={showJdModal} onOpenChange={setShowJdModal}>
    
            <DialogContent  className="sm:max-w-[800px] bg-white max-h-[90vh] overflow-y-auto">
          
            <DialogHeader>
                <DialogTitle >{title}</DialogTitle>

                {/* <DialogDescription>
                Create a new Job for Candidates.
                </DialogDescription> */}
            </DialogHeader>
                <div className="grid gap-4 py-4">

                {showJd}
                
                </div>

            
            
            </DialogContent>
        
        </Dialog>
        </>
    )
}
export default JdModalView