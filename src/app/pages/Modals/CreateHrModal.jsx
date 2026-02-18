

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/Dialog"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { createHrUser, getHrUser } from "../../Reducer/HrSlice"
import { Button, TextInput } from "flowbite-react"
  import { toast } from 'react-toastify';
const CreateHrModal=({isModalOpen,
              setIsModalOpen})=>{
const dispatch=useDispatch()
      const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
      } = useForm();

      const onSubmit=(data)=>{
        dispatch(createHrUser(data)).then((res)=>{
            console.log("res",res);
            
            if(res?.payload?.status_code===201){
                setIsModalOpen(false)
                 dispatch(getHrUser())
            }
            else if(res?.payload?.response?.data?.status_code===400){
                toast.error(res?.payload?.response?.data?.message)
            }
        })
      }
    return(
        <>
        <Dialog  open={isModalOpen} onOpenChange={setIsModalOpen}>
    
            <DialogContent  className="sm:max-w-[425px] bg-white max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
                <DialogTitle >Add New HR User</DialogTitle>
                <DialogDescription>
                Create a new account for an HR representative.
                </DialogDescription>
            </DialogHeader>
                <div className="grid gap-4 py-4">

                {/* First Name */}
                <div className="grid gap-2">
                    <label className="text-sm font-medium">First Name</label>
                    <TextInput
                    type="text"
                    {...register("firstName", {
                        required: "First name is required",
                    })}
                    />
                    {errors.firstName && (
                    <p className="text-red-500 text-sm">
                        {errors.firstName.message}
                    </p>
                    )}
                </div>

                {/* Last Name */}
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <TextInput
                    type="text"
                    {...register("lastName", {
                        required: "Last name is required",
                    })}
                    />
                    {errors.lastName && (
                    <p className="text-red-500 text-sm">
                        {errors.lastName.message}
                    </p>
                    )}
                </div>

                {/* Username */}
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Username</label>
                    <TextInput
                    type="text"
                    {...register("username", {
                        required: "Username is required",
                    })}
                    />
                    {errors.username && (
                    <p className="text-red-500 text-sm">
                        {errors.username.message}
                    </p>
                    )}
                </div>

                {/* Email */}
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Email</label>
                    <TextInput
                    type="email"
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email address",
                        },
                    })}
                    />
                    {errors.email && (
                    <p className="text-red-500 text-sm">
                        {errors.email.message}
                    </p>
                    )}
                </div>

                {/* Password */}
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Password</label>
                    <TextInput
                    type="password"
                    {...register("password", {
                        required: "Password is required",
                    })}
                    />
                    {errors.password && (
                    <p className="text-red-500 text-sm">
                        {errors.password.message}
                    </p>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Confirm Password</label>
                    <TextInput
                    type="password"
                    {...register("confirmPassword", {
                        required: "Confirm password is required",
                        validate: (value) =>
                        value === watch("password") ||
                        "Passwords do not match",
                    })}
                    />
                    {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">
                        {errors.confirmPassword.message}
                    </p>
                    )}
                </div>

                </div>

            <DialogFooter>
                <Button className="bg-[#800080] hover:bg-[#660066] text-white" type="submit" >Create User</Button>
            </DialogFooter>
            </form>
            </DialogContent>
        
        </Dialog>
        </>
    )
}
export default CreateHrModal