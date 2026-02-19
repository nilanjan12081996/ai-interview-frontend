import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../store/Api";

export const getCandidateData = createAsyncThunk(
    'getCandidateData',
    async (_, { rejectWithValue }) => {

        try {
            const response = await api.get('/interview/list');
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

export const scheduleInterview = createAsyncThunk(
    'scheduleInterview',
    async (userInput, { rejectWithValue }) => {

        try {
            const response = await api.post('/interview/schedule',userInput);
            if (response?.data?.statusCode === 201) {
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
    candidatesList:[],
    error:false,
    scheduleInterviewData:""
}
const CandidateSlice=createSlice({
    name:"candidate",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(getCandidateData.pending,(state)=>{
            state.loading=true
        })
        .addCase(getCandidateData.fulfilled,(state,{payload})=>{
            state.loading=false
            state.candidatesList=payload
            state.error=false
        })
        .addCase(getCandidateData.rejected,(state,{payload})=>{
            state.loading=false
            state.error=payload
        })
           .addCase(scheduleInterview.pending,(state)=>{
            state.loading=true
        })
        .addCase(scheduleInterview.fulfilled,(state,{payload})=>{
            state.loading=false
            state.scheduleInterviewData=payload
            state.error=false
        })
        .addCase(scheduleInterview.rejected,(state,{payload})=>{
            state.loading=false
            state.error=payload
        })
    }
})
export default CandidateSlice.reducer