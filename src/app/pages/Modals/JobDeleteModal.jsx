import { Button, Textarea, TextInput } from "flowbite-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/Dialog"
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { deleteJob, getJobs } from "../../Reducer/JobSlice";
const JobDeleteModal=({
    openDeleteModal,
    setOpenDeleteModal,
    jobid
})=>{

    const dispatch=useDispatch()


const handleDeleteButton=()=>{
    dispatch(deleteJob({id:jobid})).then((res)=>{
        if(res?.payload?.statusCode===200){
            setOpenDeleteModal(false)
             dispatch(getJobs())
        }
    })
}
    return(
        <>
            <Dialog  open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
    
            <DialogContent  className="sm:max-w-[425px] bg-white max-h-[90vh] overflow-y-auto">
          
            <DialogHeader>
                <DialogTitle >Want to delete this Job?</DialogTitle>
              
            </DialogHeader>
              <div className="flex gap-2">
                <div>
                    <Button onClick={()=>handleDeleteButton()} className="bg-[#800080]">Yes</Button>
                </div>
                <div>
                    <Button onClick={()=>{setOpenDeleteModal(false)}} className="bg-red-600">No</Button>
                </div>

              </div>

            {/* <DialogFooter>
                <Button className="bg-[#800080] hover:bg-[#660066] text-white" type="submit" >Update</Button>
            </DialogFooter> */}
           
            </DialogContent>
        
        </Dialog>
        </>
    )
}
export default JobDeleteModal