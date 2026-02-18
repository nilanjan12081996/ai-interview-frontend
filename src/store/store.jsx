import { configureStore } from "@reduxjs/toolkit";

import AuthSlice from "../app/Reducer/AuthSlice"
import HrSlice from "../app/Reducer/HrSlice"
import JobSlice from "../app/Reducer/JobSlice"
const store=configureStore({
    reducer:{
        auth:AuthSlice,
        hr:HrSlice,
        jobs:JobSlice
    }
})
export default store;