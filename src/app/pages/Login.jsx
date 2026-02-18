// import * as React from "react"
// import { Button } from "../components/ui/Button"
// import { Input } from "../components/ui/Input"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/Card"

// interface LoginProps {
//   onLogin: () => void
// }

// export function Login({ onLogin }: LoginProps) {
//   const [email, setEmail] = React.useState("")
//   const [password, setPassword] = React.useState("")

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     // Simulate login
//     onLogin()
//   }

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
//       <Card className="w-full max-w-md shadow-lg border-t-4 border-t-[#800080]">
//         <CardHeader className="space-y-1 text-center">
//           <CardTitle className="text-2xl font-bold text-[#800080]">Interviewer.ai</CardTitle>
//           <CardDescription>Enter your email below to login to your account</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="m@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Password</label>
//                 <a href="#" className="text-sm text-[#800080] hover:underline">Forgot password?</a>
//               </div>
//               <Input
//                 id="password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//             <Button type="submit" className="w-full bg-[#800080] hover:bg-[#660066]">
//               Sign In
//             </Button>
//           </form>
//         </CardContent>
//         <CardFooter className="flex justify-center border-t p-4">
//           <p className="text-xs text-gray-500">
//             &copy; 2026 Interviewer.ai. All rights reserved.
//           </p>
//         </CardFooter>
//       </Card>
//     </div>
//   )
// }













import React, { useState } from "react";
import { Button, Card, Label, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { login } from "../Reducer/AuthSlice";
import { useNavigate } from "react-router";

const Login = () => {
const dispatch=useDispatch()
const navigate=useNavigate()
const[errMsg,setErrorMsg]=useState()
    const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
 const onSubmit=(data)=>{
dispatch(login(data)).then((res)=>{
  console.log("res",res);
  if(res?.payload?.statusCode===200){
    setErrorMsg("")
    navigate("/dashboard")
  }
  if(res?.payload?.response?.data?.statusCode===422){
    setErrorMsg(res?.payload?.response?.data?.message)
  }
  
})
 }

  return (
    <div>
      <Card className="max-w-md w-full border-t-4 border-t-[#800080] shadow-xl">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-[#800080]">Interviewer.ai</h1>
          <p className="text-gray-500 mt-2">Enter your email below to login</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Email Field - Added flex-col to the wrapper */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" value="Your email" className="font-medium text-[15px]">Email</label>
            <TextInput
              id="email"
              type="email"
              placeholder="name@company.com"
              {...register("usernameOrEmail",{required:"Email or Username required"})}
             
            />
            {
             errors?.usernameOrEmail&&(
                <span className="text-red-500">{errors?.usernameOrEmail?.message}</span>
              )
            }
          </div>

          {/* Password Field - Organized for better layout */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              {/* <Label htmlFor="password" value="Your password" className="font-semibold" /> */}
               <label htmlFor="email" value="Your email" className="font-medium text-[15px]">Password</label>
              <a href="#" className="text-sm text-[#800080] hover:underline font-medium">
                Forgot password?
              </a>
            </div>
            <TextInput
              id="password"
              type="password"
              placeholder="password"
               {...register("password",{required:"Password required"})}
              
            />
            {errors?.password&&(
              <span className="text-red-500">{errors?.password?.message}</span>
            )}
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
            Sign In
          </Button>
        </form>

        <div className="mt-4 border-t pt-4 text-center">
          <p className="text-xs text-gray-400">
            &copy; 2026 Interviewer.ai. All rights reserved.
          </p>
        </div>
      </Card>
    </div>
  );
}

export default Login;