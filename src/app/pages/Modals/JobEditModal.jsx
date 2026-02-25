
import { Button, Textarea, TextInput } from "flowbite-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/Dialog"
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { getJobs, updateJob } from "../../Reducer/JobSlice";
const JobEditModal=({
    openEditModal,
    setOpenEditModal,
    jobid
})=>{
const{singleJob}=useSelector((state)=>state?.jobs)
       const dispatch=useDispatch()
          const {
            register,
            setValue,
            watch,
            handleSubmit,
            formState: { errors },
          } = useForm();
console.log("singlejob",singleJob);
useEffect(()=>{
setValue("clientName",singleJob?.data?.clientName)
setValue("role",singleJob?.data?.role)
setValue("jd",singleJob?.data?.jd)
},[singleJob])

const onSubmit=(data)=>{
    dispatch(updateJob({
        id:jobid,
        data:data
    })).then((res)=>{
        if(res?.payload?.statusCode===200){
            setOpenEditModal(false)
             dispatch(getJobs())
        }
    })
}
    return(
        <>
          <Dialog  open={openEditModal} onOpenChange={setOpenEditModal}>
    
            <DialogContent  className="sm:max-w-[425px] bg-white max-h-[90vh] overflow-y-auto">
            <form
             onSubmit={handleSubmit(onSubmit)}
             >
            <DialogHeader>
                <DialogTitle >Edit Job</DialogTitle>
                <DialogDescription>
                Edit Job.
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
                    rows={6}
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
                <Button className="bg-[#800080] hover:bg-[#660066] text-white" type="submit" >Update</Button>
            </DialogFooter>
            </form>
            </DialogContent>
        
        </Dialog>
        </>
    )
}
export default JobEditModal