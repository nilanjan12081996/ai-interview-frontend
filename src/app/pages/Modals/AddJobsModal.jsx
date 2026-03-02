// import { Button, Textarea, TextInput } from "flowbite-react"
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/Dialog"
// import { useDispatch } from "react-redux";
// import { useForm } from "react-hook-form";
// import { createJobs, getJobs } from "../../Reducer/JobSlice";
// const AddJobsModal=({
//      isModalOpen,
//     setIsModalOpen
// })=>{
//     const dispatch=useDispatch()
//       const {
//         register,
//         watch,
//         handleSubmit,
//         formState: { errors },
//       } = useForm();

//       const onSubmit=(data)=>{
//        dispatch(createJobs({...data})).then((res)=>{
//         if(res?.payload?.statusCode===201)
//         {
//             dispatch(getJobs())
//             setIsModalOpen(false)
//         }
//        })
        
//       }

//     return(
//         <>
//         <Dialog  open={isModalOpen} onOpenChange={setIsModalOpen}>
    
//             <DialogContent  className="sm:max-w-[800px] bg-white max-h-[90vh] overflow-y-auto">
//             <form onSubmit={handleSubmit(onSubmit)}>
//             <DialogHeader>
//                 <DialogTitle >Add New Job</DialogTitle>
//                 <DialogDescription>
//                 Create a new Job for Candidates.
//                 </DialogDescription>
//             </DialogHeader>
//                 <div className="grid gap-4 py-4">

//                 {/* First Name */}
//                 <div className="grid gap-2">
//                     <label className="text-sm font-medium">Cilent Name</label>
//                     <TextInput
//                     type="text"
//                     {...register("clientName", {
//                         required: "Cilent name is required",
//                     })}
//                     />
//                     {errors.clientName && (
//                     <p className="text-red-500 text-sm">
//                         {errors.clientName.message}
//                     </p>
//                     )}
//                 </div>
               

//                 {/* Password */}
//                 <div className="grid gap-2">
//                     <label className="text-sm font-medium">Role</label>
//                     <TextInput
//                     type="text"
//                     {...register("role", {
//                         required: "Role is required",
//                     })}
//                     />
//                     {errors.role && (
//                     <p className="text-red-500 text-sm">
//                         {errors.role.message}
//                     </p>
//                     )}
//                 </div>

//                 {/* Confirm Password */}
//                 <div className="grid gap-2">
//                     <label className="text-sm font-medium">Job Description</label>
//                     <Textarea
//                     type="text"
//                     rows={6}
//                     {...register("jd", {
//                         required: "Job Description is required"})}
//                     />
//                     {errors.jd && (
//                     <p className="text-red-500 text-sm">
//                         {errors.jd.message}
//                     </p>
//                     )}
//                 </div>

//                 </div>

//             <DialogFooter>
//                 <Button className="bg-[#800080] hover:bg-[#660066] text-white" type="submit" >Create Job</Button>
//             </DialogFooter>
//             </form>
//             </DialogContent>
        
//         </Dialog>
//         </>
//     )
// }
// export default AddJobsModal








 import { Button, Textarea, TextInput } from "flowbite-react"
 import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/Dialog"
import { useForm, useFieldArray } from "react-hook-form";
import { createJobs, getJobs } from "../../Reducer/JobSlice";
import { useDispatch } from "react-redux";


// export default function AddJobDialog({
//   isModalOpen,
//   setIsModalOpen,
// }) {
//     const dispatch=useDispatch()
//   const {
//     register,
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       clientName: "",
//       role: "",
//       jd: "",
//       experience: "",
//       mandatorySkills: [{ skillName: "" }],
//       mustHaveSkills: [{ skillName: "" }],
//     },
//   });

//   // Mandatory Skills Field Array
//   const {
//     fields: mandatoryFields,
//     append: appendMandatory,
//     remove: removeMandatory,
//   } = useFieldArray({
//     control,
//     name: "mandatorySkills",
//   });

//   // Nice To Have Skills Field Array
//   const {
//     fields: niceFields,
//     append: appendNice,
//     remove: removeNice,
//   } = useFieldArray({
//     control,
//     name: "niceToHaveSkills",
//   });

//   const onSubmit = (data) => {
//     const payload = {
//       ...data,
//       mandatorySkills: data.mandatorySkills.map((s) => s.skillName),
//       niceToHaveSkills: data.niceToHaveSkills.map((s) => s.skillName),
//     };
//            dispatch(createJobs({...data})).then((res)=>{
//         if(res?.payload?.statusCode===201)
//         {
//             dispatch(getJobs())
//             setIsModalOpen(false)
//         }
//        })



//   };

//   return (
//     <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//       <DialogContent className="sm:max-w-[800px] bg-white max-h-[90vh] overflow-y-auto">
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <DialogHeader>
//             <DialogTitle>Add New Job</DialogTitle>
//             <DialogDescription>
//               Create a new Job for Candidates.
//             </DialogDescription>
//           </DialogHeader>

//           <div className="grid gap-4 py-4">
//             {/* Client Name */}
//             <div className="grid gap-2">
//               <label className="text-sm font-medium">Client Name</label>
//               <TextInput
//                 {...register("clientName", {
//                   required: "Client name is required",
//                 })}
//               />
//               {errors.clientName && (
//                 <p className="text-red-500 text-sm">
//                   {errors.clientName.message}
//                 </p>
//               )}
//             </div>

//             {/* Role */}
//             <div className="grid gap-2">
//               <label className="text-sm font-medium">Role</label>
//               <TextInput
//                 {...register("role", {
//                   required: "Role is required",
//                 })}
//               />
//               {errors.role && (
//                 <p className="text-red-500 text-sm">
//                   {errors.role.message}
//                 </p>
//               )}
//             </div>

//             {/* Experience */}
//             <div className="grid gap-2">
//               <label className="text-sm font-medium">
//                 Experience (Years)
//               </label>
//               <TextInput
//                 type="text"
//                 {...register("experience", {
//                   required: "Experience is required",
//                 })}
//               />
//               {errors.experience && (
//                 <p className="text-red-500 text-sm">
//                   {errors.experience.message}
//                 </p>
//               )}
//             </div>

//             {/* Job Description */}
           

//             {/* Mandatory Skills */}
//             <div className="grid gap-2">
//               <label className="text-sm font-medium">
//                 Mandatory Skills
//               </label>

//               {mandatoryFields.map((field, index) => (
//                 <div key={field.id} className="flex gap-2 items-center">
//                   <TextInput
//                     {...register(
//                       `mandatorySkills.${index}.skillName`,
//                       {
//                         required:
//                           "Mandatory skill cannot be empty",
//                       }
//                     )}
//                   />

//                   <Button className="bg-[#800080]"
//                     type="button"
//                     onClick={() =>
//                       appendMandatory({ skillName: "" })
//                     }
//                   >
//                     +
//                   </Button>

//                   {mandatoryFields.length > 1 && (
//                     <Button
//                     className="bg-[#800080]"
//                       type="button"
                    
//                       onClick={() =>
//                         removeMandatory(index)
//                       }
//                     >
//                       -
//                     </Button>
//                   )}
//                 </div>
//               ))}
//             </div>

//             {/* Nice To Have Skills */}
//             <div className="grid gap-2">
//               <label className="text-sm font-medium">
//                 Nice To Have Skills
//               </label>

//               {niceFields.map((field, index) => (
//                 <div key={field.id} className="flex gap-2 items-center">
//                   <TextInput
//                     {...register(
//                       `niceToHaveSkills.${index}.skillName`
//                     )}
//                   />

//                   <Button
//                   className="bg-[#800080]"
//                     type="button"
//                     onClick={() =>
//                       appendNice({ skillName: "" })
//                     }
//                   >
//                     +
//                   </Button>

//                   {niceFields.length > 1 && (
//                     <Button
//                       type="button"
//                       className="bg-[#800080]"
//                       onClick={() =>
//                         removeNice(index)
//                       }
//                     >
//                       -
//                     </Button>
//                   )}
//                 </div>
//               ))}
//             </div>

//              <div className="grid gap-2">
//               <label className="text-sm font-medium">
//                 Job Description
//               </label>
//               <Textarea
//                 rows={5}
//                 {...register("jd", {
//                   required: "Job Description is required",
//                 })}
//               />
//               {errors.jd && (
//                 <p className="text-red-500 text-sm">
//                   {errors.jd.message}
//                 </p>
//               )}
//             </div>
//           </div>

//           <DialogFooter>
//             <Button
//               className="bg-[#800080] hover:bg-[#660066] text-white"
//               type="submit"
//             >
//               Create Job
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }



export default function AddJobDialog({
  isModalOpen,
  setIsModalOpen,
}) {
  const dispatch = useDispatch();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      clientName: "",
      role: "",
      jd: "",
      experience: "",
      mandatorySkills: [{ skillName: "" }],
      niceToHaveSkills: [{ skillName: "" }],
    },
  });

  // Mandatory Skills
  const {
    fields: mandatoryFields,
    append: appendMandatory,
    remove: removeMandatory,
  } = useFieldArray({
    control,
    name: "mandatorySkills",
  });

  // Nice To Have Skills (will be renamed to mustHaveSkills)
  const {
    fields: niceFields,
    append: appendNice,
    remove: removeNice,
  } = useFieldArray({
    control,
    name: "niceToHaveSkills",
  });

  const onSubmit = ({ niceToHaveSkills, ...rest }) => {
    const payload = {
      ...rest,
      mustHaveSkills: niceToHaveSkills, // 🔥 rename here
    };

    dispatch(createJobs(payload)).then((res) => {
      if (res?.payload?.statusCode === 201) {
        dispatch(getJobs());
        setIsModalOpen(false);
      }
    });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-[800px] bg-white max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add New Job</DialogTitle>
            <DialogDescription>
              Create a new Job for Candidates.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">

            {/* Client Name */}
            <div className="grid gap-2">
              <label className="text-sm font-medium">Client Name</label>
              <TextInput
                {...register("clientName", {
                  required: "Client name is required",
                })}
              />
              {errors.clientName && (
                <p className="text-red-500 text-sm">
                  {errors.clientName.message}
                </p>
              )}
            </div>

            {/* Role */}
            <div className="grid gap-2">
              <label className="text-sm font-medium">Role</label>
              <TextInput
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

            {/* Experience */}
            <div className="grid gap-2">
              <label className="text-sm font-medium">Experience</label>
              <TextInput
                {...register("experience", {
                  required: "Experience is required",
                })}
              />
              {errors.experience && (
                <p className="text-red-500 text-sm">
                  {errors.experience.message}
                </p>
              )}
            </div>

            {/* Mandatory Skills */}
            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Mandatory Skills
              </label>

              {mandatoryFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-center">
                  <TextInput
                    {...register(
                      `mandatorySkills.${index}.skillName`,
                      {
                        required:
                          "Mandatory skill cannot be empty",
                      }
                    )}
                  />

                  <Button
                    type="button"
                    className="bg-[#800080]"
                    onClick={() =>
                      appendMandatory({ skillName: "" })
                    }
                  >
                    +
                  </Button>

                  {mandatoryFields.length > 1 && (
                    <Button
                      type="button"
                      className="bg-[#800080]"
                      onClick={() =>
                        removeMandatory(index)
                      }
                    >
                      -
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Nice To Have Skills */}
            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Nice To Have Skills
              </label>

              {niceFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-center">
                  <TextInput
                    {...register(
                      `niceToHaveSkills.${index}.skillName`
                    )}
                  />

                  <Button
                    type="button"
                    className="bg-[#800080]"
                    onClick={() =>
                      appendNice({ skillName: "" })
                    }
                  >
                    +
                  </Button>

                  {niceFields.length > 1 && (
                    <Button
                      type="button"
                      className="bg-[#800080]"
                      onClick={() =>
                        removeNice(index)
                      }
                    >
                      -
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Job Description */}
            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Job Description
              </label>
              <Textarea
                rows={5}
                {...register("jd", {
                  required: "Job Description is required",
                })}
              />
              {errors.jd && (
                <p className="text-red-500 text-sm">
                  {errors.jd.message}
                </p>
              )}
            </div>

          </div>

          <DialogFooter>
            <Button
              className="bg-[#800080] hover:bg-[#660066] text-white"
              type="submit"
            >
              Create Job
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


