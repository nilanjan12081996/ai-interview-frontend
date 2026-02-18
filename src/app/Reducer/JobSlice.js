import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../store/Api";

export const getJobs = createAsyncThunk(
    'getJobs',
    async (_, { rejectWithValue }) => {

        try {
            const response = await api.get('/job/list-jobs');
            if (response?.data?.statusCode === 200) {
                return response.data;
            } else {
                return rejectWithValue(response.data);
            }
        } catch (err) {
            
            return rejectWithValue(err);
        }
    }
)

export const createJobs = createAsyncThunk(
    'createJobs',
    async (userInput, { rejectWithValue }) => {

        try {
            const response = await api.post('/job/create-job',userInput);
            if (response?.data?.statusCode === 201) {
                return response.data;
            } else {
                return rejectWithValue(response.data);
            }
        } catch (err) {
            
            return rejectWithValue(err);
        }
    }
)
const initialState={
    loading:false,
    error:false,
    allJobs:[],
    createJobData:""
}
const JobSlice=createSlice({
    name:"jobs",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(getJobs.pending,(state)=>{
            state.loading=true
        })
        .addCase(getJobs.fulfilled,(state,{payload})=>{
            state.loading=false
            state.allJobs=payload
            state.error=false
        })
        .addCase(getJobs.rejected,(state,{payload})=>{
            state.loading=false
            state.error=payload
        })
         .addCase(createJobs.pending,(state)=>{
            state.loading=true
        })
        .addCase(createJobs.fulfilled,(state,{payload})=>{
            state.loading=false
            state.createJobData=payload
            state.error=false
        })
        .addCase(createJobs.rejected,(state,{payload})=>{
            state.loading=false
            state.error=payload
        })
    }
})
export default JobSlice.reducer;