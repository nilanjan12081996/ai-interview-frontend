import { TextInput } from "flowbite-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/Dialog"
const AccessDeniedModal=({ accessDeniedModal,setAccessDeniedModal,causeData})=>{
    return(
        <>
        <Dialog open={accessDeniedModal} onOpenChange={setAccessDeniedModal}>
      <DialogContent className="sm:max-w-[800px] bg-white max-h-[90vh] overflow-y-auto">
      
          <DialogHeader>
            <DialogTitle>Access Denied Cause</DialogTitle>
            {/* <DialogDescription>
              Create a new Job for Candidates.
            </DialogDescription> */}
          </DialogHeader>

          <div className="grid gap-4 py-4">

           
            <div className="grid gap-2">
              <label className="text-sm font-medium">Termination Cause</label>
                {causeData?.terminationCause}
            </div>

               <div className="grid gap-2">
              <label className="text-sm font-medium">User Justification</label>
                {causeData?.userJustification}
            </div>

          
           

          </div>

          <DialogFooter>
            {/* <Button
              className="bg-[#800080] hover:bg-[#660066] text-white"
              type="submit"
            >
              Create Job
            </Button> */}
          </DialogFooter>
    
      </DialogContent>
    </Dialog>
        </>
    )
}
export default AccessDeniedModal;