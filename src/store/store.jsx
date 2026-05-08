import { configureStore } from "@reduxjs/toolkit";

import AuthSlice from "../app/Reducer/AuthSlice"
import HrSlice from "../app/Reducer/HrSlice"
import JobSlice from "../app/Reducer/JobSlice"
import CandidateSlice from "../app/Reducer/CandidateSlice"
import QuestionSlice from "../app/Reducer/QuestionSlice"
import DashboardSlice from "../app/Reducer/DashboardSlice"
import ProfileSlice from "../app/Reducer/ProfileSlice"

const store=configureStore({
    reducer:{
        auth:AuthSlice,
        hr:HrSlice,
        jobs:JobSlice,
        candidate:CandidateSlice,
        questions:QuestionSlice,
        dashboard:DashboardSlice,
        profile:ProfileSlice
    }
})
export default store;