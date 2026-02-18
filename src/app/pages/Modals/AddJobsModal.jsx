import { Button, Textarea, TextInput } from "flowbite-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/Dialog"
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { createJobs, getJobs } from "../../Reducer/JobSlice";
const AddJobsModal=({
     isModalOpen,
    setIsModalOpen
})=>{
    const dispatch=useDispatch()
      const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
      } = useForm();

      const onSubmit=(data)=>{
       dispatch(createJobs(data)).then((res)=>{
        if(res?.payload?.statusCode===201)
        {
            dispatch(getJobs())
            setIsModalOpen(false)
        }
       })
        
      }

    return(
        <>
        <Dialog  open={isModalOpen} onOpenChange={setIsModalOpen}>
    
            <DialogContent  className="sm:max-w-[425px] bg-white max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
                <DialogTitle >Add New Job</DialogTitle>
                <DialogDescription>
                Create a new Job for Candidates.
                </DialogDescription>
            </DialogHeader>
                <div className="grid gap-4 py-4">

                {/* First Name */}
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Cilent Name</label>
                    <TextInput
                    type="text"
                    {...register("clientName", {
                        required: "Cilent name is required",
                    })}
                    />
                    {errors.clientName && (
                    <p className="text-red-500 text-sm">
                        {errors.clientName.message}
                    </p>
                    )}
                </div>
               

                {/* Password */}
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Role</label>
                    <TextInput
                    type="text"
                    {...register("role", {
                        required: "Role is required",
                    })}
                    />
                    {errors.role && (
                    <p className="text-red-500 text-sm">
                        {errors.role.message}
                    </p>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Job Description</label>
                    <Textarea
                    type="text"
                    {...register("jd", {
                        required: "Job Description is required"})}
                    />
                    {errors.jd && (
                    <p className="text-red-500 text-sm">
                        {errors.jd.message}
                    </p>
                    )}
                </div>

                </div>

            <DialogFooter>
                <Button className="bg-[#800080] hover:bg-[#660066] text-white" type="submit" >Create Job</Button>
            </DialogFooter>
            </form>
            </DialogContent>
        
        </Dialog>
        </>
    )
}
export default AddJobsModal