import { configureStore } from "@reduxjs/toolkit";

import AuthSlice from "../app/Reducer/AuthSlice"
import HrSlice from "../app/Reducer/HrSlice"
import JobSlice from "../app/Reducer/JobSlice"
import CandidateSlice from "../app/Reducer/CandidateSlice"
const store=configureStore({
    reducer:{
        auth:AuthSlice,
        hr:HrSlice,
        jobs:JobSlice,
        candidate:CandidateSlice,
    }
})
export default store;