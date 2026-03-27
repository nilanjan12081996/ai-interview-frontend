
// import { Button, Textarea, TextInput } from "flowbite-react"
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/Dialog"
// import { useDispatch, useSelector } from "react-redux";
// import { useForm } from "react-hook-form";
// import { useEffect } from "react";
// import { getJobs, updateJob } from "../../Reducer/JobSlice";
// const JobEditModal=({
//     openEditModal,
//     setOpenEditModal,
//     jobid
// })=>{
// const{singleJob}=useSelector((state)=>state?.jobs)
//        const dispatch=useDispatch()
//           const {
//             register,
//             setValue,
//             watch,
//             handleSubmit,
//             formState: { errors },
//           } = useForm();
// console.log("singlejob",singleJob);
// useEffect(()=>{
// setValue("clientName",singleJob?.data?.clientName)
// setValue("role",singleJob?.data?.role)
// setValue("jd",singleJob?.data?.jd)
// },[singleJob])

// const onSubmit=(data)=>{
//     dispatch(updateJob({
//         id:jobid,
//         data:data
//     })).then((res)=>{
//         if(res?.payload?.statusCode===200){
//             setOpenEditModal(false)
//              dispatch(getJobs())
//         }
//     })
// }
//     return(
//         <>
//           <Dialog  open={openEditModal} onOpenChange={setOpenEditModal}>
    
//             <DialogContent  className="sm:max-w-[425px] bg-white max-h-[90vh] overflow-y-auto">
//             <form
//              onSubmit={handleSubmit(onSubmit)}
//              >
//             <DialogHeader>
//                 <DialogTitle >Edit Job</DialogTitle>
//                 <DialogDescription>
//                 Edit Job.
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
//                 <Button className="bg-[#800080] hover:bg-[#660066] text-white" type="submit" >Update</Button>
//             </DialogFooter>
//             </form>
//             </DialogContent>
        
//         </Dialog>
//         </>
//     )
// }
// export default JobEditModal



// import { Button, Textarea, TextInput } from "flowbite-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "../../components/ui/Dialog";
// import { useDispatch, useSelector } from "react-redux";
// import { useForm, useFieldArray } from "react-hook-form";
// import { useEffect } from "react";
// import { getJobs, updateJob } from "../../Reducer/JobSlice";

// const JobEditModal = ({
//   openEditModal,
//   setOpenEditModal,
//   jobid,
// }) => {
//   const { singleJob } = useSelector((state) => state?.jobs);
//   const dispatch = useDispatch();

//   const {
//     register,
//     control,
//     handleSubmit,
//     reset,
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

//   // Mandatory Skills
//   const {
//     fields: mandatoryFields,
//     append: appendMandatory,
//     remove: removeMandatory,
//   } = useFieldArray({
//     control,
//     name: "mandatorySkills",
//   });

//   // Must Have Skills
//   const {
//     fields: mustFields,
//     append: appendMust,
//     remove: removeMust,
//   } = useFieldArray({
//     control,
//     name: "mustHaveSkills",
//   });

//   // ✅ Prefill Data
//   useEffect(() => {
//     if (singleJob?.data) {
//       reset({
//         clientName: singleJob.data.clientName,
//         role: singleJob.data.role,
//         jd: singleJob.data.jd,
//         experience: singleJob.data.experience,
//         mandatorySkills:
//           singleJob.data.mandatorySkills?.map((skill) => ({
//             skillName: skill.skillName,
//           })) || [{ skillName: "" }],
//         mustHaveSkills:
//           singleJob.data.mustHaveSkills?.map((skill) => ({
//             skillName: skill.skillName,
//           })) || [{ skillName: "" }],
//       });
//     }
//   }, [singleJob, reset]);

//   const onSubmit = (data) => {
//     dispatch(
//       updateJob({
//         id: jobid,
//         data: data,
//       })
//     ).then((res) => {
//       if (res?.payload?.statusCode === 200) {
//         setOpenEditModal(false);
//         dispatch(getJobs());
//       }
//     });
//   };

//   return (
//     <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
//       <DialogContent className="sm:max-w-[800px] bg-white max-h-[90vh] overflow-y-auto">
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <DialogHeader>
//             <DialogTitle>Edit Job</DialogTitle>
//             <DialogDescription>
//               Update Job Details.
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
//             </div>

//             {/* Experience */}
//             <div className="grid gap-2">
//               <label className="text-sm font-medium">Experience</label>
//               <TextInput
//                 {...register("experience", {
//                   required: "Experience is required",
//                 })}
//               />
//             </div>

//             {/* Mandatory Skills */}
//             <div className="grid gap-2">
//               <label className="text-sm font-medium">
//                 Mandatory Skills
//               </label>

//               {mandatoryFields.map((field, index) => (
//                 <div key={field.id} className="flex gap-2">
//                   <TextInput
//                     {...register(
//                       `mandatorySkills.${index}.skillName`,
//                       { required: "Mandatory skill required" }
//                     )}
//                   />

//                   <Button
//                   className="bg-[#800080]"
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

//             {/* Must Have Skills */}
//             <div className="grid gap-2">
//               <label className="text-sm font-medium">
//                 Must Have Skills
//               </label>

//               {mustFields.map((field, index) => (
//                 <div key={field.id} className="flex gap-2">
//                   <TextInput
//                     {...register(
//                       `mustHaveSkills.${index}.skillName`
//                     )}
//                   />

//                   <Button
//                   className="bg-[#800080]"
//                     type="button"
//                     onClick={() =>
//                       appendMust({ skillName: "" })
//                     }
//                   >
//                     +
//                   </Button>

//                   {mustFields.length > 1 && (
//                     <Button
//                     className="bg-[#800080]"
//                       type="button"
//                       onClick={() =>
//                         removeMust(index)
//                       }
//                     >
//                       -
//                     </Button>
//                   )}
//                 </div>
//               ))}
//             </div>

//             {/* Job Description */}
//             <div className="grid gap-2">
//               <label className="text-sm font-medium">
//                 Job Description
//               </label>
//               <Textarea
//                 rows={5}
//                 {...register("jd", {
//                   required: "Job Description is required",
//                 })}
//               />
//             </div>
//           </div>

//           <DialogFooter>
//             <Button
//               className="bg-[#800080] hover:bg-[#660066] text-white"
//               type="submit"
//             >
//               Update Job
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default JobEditModal;






import { Button, Select, Textarea, TextInput } from "flowbite-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/Dialog";
import { useDispatch, useSelector } from "react-redux";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect } from "react";
import { getJobs, updateJob } from "../../Reducer/JobSlice";

const JobEditModal = ({
  openEditModal,
  setOpenEditModal,
  jobid,
}) => {
  const { singleJob } = useSelector((state) => state?.jobs);
  const dispatch = useDispatch();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      clientName: "",
      role: "",
      jd: "",
      experience: "",
      mandatorySkills: [{ skillName: "" }],
      mustHaveSkills: [{ skillName: "" }],
    },
  });

  // ==============================
  // Field Arrays
  // ==============================

  const {
    fields: mandatoryFields,
    append: appendMandatory,
    remove: removeMandatory,
  } = useFieldArray({
    control,
    name: "mandatorySkills",
  });

  const {
    fields: mustFields,
    append: appendMust,
    remove: removeMust,
  } = useFieldArray({
    control,
    name: "mustHaveSkills",
  });

  // ==============================
  // Helper: Map Skills Safely
  // ==============================

  const mapSkills = (skills) =>
    skills && skills.length > 0
      ? skills.map((skill) => ({
          skillName: skill.skillName,
        }))
      : [{ skillName: "" }];

  // ==============================
  // Prefill Data
  // ==============================

  useEffect(() => {
    if (singleJob?.data) {
      reset({
        clientName: singleJob.data.clientName || "",
        role: singleJob.data.role || "",
        jd: singleJob.data.jd || "",
        experience: singleJob.data.experience || "",
        mandatorySkills: mapSkills(singleJob.data.mandatorySkills),
        mustHaveSkills: mapSkills(singleJob.data.mustHaveSkills),
        level:singleJob.data.level
      });
    }
  }, [singleJob, reset]);

  // ==============================
  // Submit
  // ==============================

  const onSubmit = (data) => {
    // Remove empty skills before sending
    const cleanedData = {
      ...data,
      mandatorySkills: data.mandatorySkills.filter(
        (skill) => skill.skillName.trim() !== ""
      ),
      mustHaveSkills: data.mustHaveSkills.filter(
        (skill) => skill.skillName.trim() !== ""
      ),
    };

    dispatch(
      updateJob({
        id: jobid,
        data: cleanedData,
      })
    ).then((res) => {
      if (res?.payload?.statusCode === 200) {
        setOpenEditModal(false);
        dispatch(getJobs());
      }
    });
  };

  // ==============================
  // UI
  // ==============================

  return (
    <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
      <DialogContent className="sm:max-w-[800px] bg-white max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
            <DialogDescription>
              Update Job Details
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
            </div>

            {/* Experience */}
            <div className="grid gap-2">
              <label className="text-sm font-medium">Experience</label>
              <TextInput
                {...register("experience", {
                  required: "Experience is required",
                })}
              />
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
                        required: "Mandatory skill required",
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

            {/* Must Have Skills */}
            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Nice to Have Skills
              </label>

              {mustFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-center">
                  <TextInput
                    {...register(
                      `mustHaveSkills.${index}.skillName`
                    )}
                  />

                  <Button
                    type="button"
                    className="bg-[#800080]"
                    onClick={() =>
                      appendMust({ skillName: "" })
                    }
                  >
                    +
                  </Button>

                  {mustFields.length > 1 && (
                    <Button
                      type="button"
                      className="bg-[#800080]"
                      onClick={() =>
                        removeMust(index)
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
            </div>
               <div className="grid gap-2">
                          <label className="text-sm font-medium">
                            Job Level
                          </label>
                         <Select {...register("level")}>
                          <option value="">---Select---</option>
                          <option value="ADVANCE">Advance</option>
                          <option value="HARD">Hard</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="LOW">Low</option>
                         </Select>
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
              Update Job
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JobEditModal;