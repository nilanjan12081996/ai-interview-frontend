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


export const jobStatusToggle = createAsyncThunk(
    'jobStatusToggle',
    async ({id}, { rejectWithValue }) => {

        try {
            const response = await api.patch(`/job/status/${id}`);
            if (response?.data?.statusCode === 200) {
                return response.data;
            } else {
                return rejectWithValue(response.data);
            }
        } catch (err) {
            // let errors = errorHandler(err);
            return rejectWithValue(err);
        }
    }
)

export const getSingleJob = createAsyncThunk(
    'getSingleJob',
    async ({id}, { rejectWithValue }) => {

        try {
            const response = await api.get(`/job/${id}`);
            if (response?.data?.statusCode === 200) {
                return response.data;
            } else {
                return rejectWithValue(response.data);
            }
        } catch (err) {
            // let errors = errorHandler(err);
            return rejectWithValue(err);
        }
    }
)

export const updateJob = createAsyncThunk(
    'updateJob',
    async ({id,data}, { rejectWithValue }) => {

        try {
            const response = await api.put(`/job/update-job/${id}`,data);
            if (response?.data?.statusCode === 200) {
                return response.data;
            } else {
                return rejectWithValue(response.data);
            }
        } catch (err) {
            // let errors = errorHandler(err);
            return rejectWithValue(err);
        }
    }
)

export const deleteJob = createAsyncThunk(
    'deleteJob',
    async ({id}, { rejectWithValue }) => {

        try {
            const response = await api.delete(`/job/delete-job/${id}`);
            if (response?.data?.statusCode === 200) {
                return response.data;
            } else {
                return rejectWithValue(response.data);
            }
        } catch (err) {
            // let errors = errorHandler(err);
            return rejectWithValue(err);
        }
    }
)

export const getCandidateByJob = createAsyncThunk(
    'getCandidateByJob',
    async ({id}, { rejectWithValue }) => {

        try {
            const response = await api.get(`/interview/job/candidates/${id}`);
            if (response?.data?.statusCode === 200) {
                return response.data;
            } else {
                return rejectWithValue(response.data);
            }
        } catch (err) {
            // let errors = errorHandler(err);
            return rejectWithValue(err);
        }
    }
)

const initialState={
    loading:false,
    error:false,
    allJobs:[],
    createJobData:"",
    singleJob:{},
    updateJobData:{},
    deleteJobData:"",
    candidateByJobData:[]
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
             .addCase(getSingleJob.pending,(state)=>{
            state.loading=true
        })
        .addCase(getSingleJob.fulfilled,(state,{payload})=>{
            state.loading=false
            state.singleJob=payload
            state.error=false
        })
        .addCase(getSingleJob.rejected,(state,{payload})=>{
            state.loading=false
            state.error=payload
        })
        .addCase(updateJob.pending,(state)=>{
            state.loading=true
        })
        .addCase(updateJob.fulfilled,(state,{payload})=>{
            state.loading=false
            state.updateJobData=payload
            state.error=false
        })
        .addCase(updateJob.rejected,(state,{payload})=>{
            state.loading=false
            state.error=payload
        })
            .addCase(deleteJob.pending,(state)=>{
            state.loading=true
        })
        .addCase(deleteJob.fulfilled,(state,{payload})=>{
            state.loading=false
            state.deleteJobData=payload
            state.error=false
        })
        .addCase(deleteJob.rejected,(state,{payload})=>{
            state.loading=false
            state.error=payload
        })
          .addCase(getCandidateByJob.pending,(state)=>{
            state.loading=true
        })
        .addCase(getCandidateByJob.fulfilled,(state,{payload})=>{
            state.loading=false
            console.log("payload",payload);
            
            state.candidateByJobData=payload
            state.error=false
        })
        .addCase(getCandidateByJob.rejected,(state,{payload})=>{
            state.loading=false
            state.error=payload
        })
    }
})
export default JobSlice.reducer;