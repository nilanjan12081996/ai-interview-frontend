
import React, { useState } from "react";
import { Button, Card, Label, Select, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { hrLogin, login, resetPassword } from "../Reducer/AuthSlice";
import { useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const Setting=()=>{
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const[errMsg,setErrorMsg]=useState()
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

        const {
        register,
        watch,
        handleSubmit,
        reset,
        formState: { errors },
      } = useForm();
     const newPassword = watch("newPassword")
     const onSubmit=(data)=>{
   
      dispatch(resetPassword(data)).then((res)=>{
      console.log("res",res);
      if(res?.payload?.statusCode===200){
        setErrorMsg("")
        // navigate("/dashboard")
        toast.success(res?.payload?.message)
        reset()
      }
      if(res?.payload?.response?.data?.statusCode===422){
        setErrorMsg(res?.payload?.response?.data?.message)
      }
        if(res?.payload?.response?.data?.statusCode===401){
        setErrorMsg(res?.payload?.response?.data?.message)
      }
      
    })
    }
    
    
     
    return(
        <>
        
          <div className="p-4 text-center text-gray-500">
            <ToastContainer/>
          <div className="flex justify-center">

          
                 <Card className="max-w-md w-full  shadow-xl">
                   <div className="text-center mb-4">
                     <h1 className="text-3xl font-bold text-[#800080]">Reset Your Password</h1>
                     {/* <p className="text-gray-500 mt-2">Enter your email below to login</p> */}
                   </div>
           
                   <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                     {/* Email Field - Added flex-col to the wrapper */}
                     
                     <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                       <label htmlFor="oldPassword" value="Your email" className="font-medium text-[15px]">Old Password</label>
                       </div>
                        <div className="relative">
                          <TextInput
                            id="oldPassword"
                            type={showOldPassword ? "text" : "password"}
                            placeholder="old password"
                            {...register("oldPassword", { required: "Old password required" })}
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#800080] transition-colors"
                          >
                            {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                       {
                        errors?.oldPassword&&(
                           <span className="text-red-500 text-left">{errors?.oldPassword?.message}</span>
                         )
                       }
                     </div>
           
                     {/* Password Field - Organized for better layout */}
                     <div className="flex flex-col gap-2">
                       <div className="flex items-center justify-between">
                         {/* <Label htmlFor="password" value="Your password" className="font-semibold" /> */}
                          <label htmlFor="newPassword" value="Your email" className="font-medium text-[15px]">New Password</label>
                        
                       </div>
                        <div className="relative">
                          <TextInput
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            placeholder="New Password"
                            {...register("newPassword", { required: "New Password required" })}
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#800080] transition-colors"
                          >
                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                       {errors?.newPassword&&(
                         <span className="text-red-500 text-left">{errors?.newPassword?.message}</span>
                       )}
                     </div>

                       <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                       <label htmlFor="confirmPassword" value="Your email" className="font-medium text-[15px]">Confirm Password</label>
                       </div>
                        <div className="relative">
                          <TextInput
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="confirm password"
                            {...register("confirmPassword", {
                              required: "Confirm Password required",
                              validate: (value) =>
                                value === newPassword || "Passwords do not match",
                            })}
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#800080] transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                       {
                        errors?.confirmPassword&&(
                           <span className="text-red-500 text-left">{errors?.confirmPassword?.message}</span>
                         )
                       }
                     </div>
                     <div className="text-center">
                       {
                         errMsg&&(
                            <span className="text-red-500 text-center">{errMsg}</span>
                         )
                       }
                      
                     </div>
           
                     <Button 
                       type="submit" 
                       style={{ backgroundColor: '#800080' }} 
                       className="hover:bg-[#660066] transition-colors mt-2"
                     >
                       Reset
                     </Button>
                   </form>
           
                   {/* <div className="mt-4 border-t pt-4 text-center">
                     <p className="text-xs text-gray-400">
                       &copy; 2026 Interviewer.ai. All rights reserved.
                     </p>
                   </div> */}
                 </Card>
               </div>
          </div>
        </>
    )
}
export default Setting;