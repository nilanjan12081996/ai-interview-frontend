import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getInterviewResult = createAsyncThunk(
    'interviewResult/get',
    async ({ token, interviewLink }, { rejectWithValue }) => {
        try {
            const encodedLink = encodeURIComponent(interviewLink);
            // Use the python backend URL from env
            const baseUrl = import.meta.env.VITE_PYTHON_API_URL || 'https://aiinterviewpythonmain.bestworks.cloud';
            const response = await axios.get(`${baseUrl}/api/v1/interview/final-result?token=${token}&interview_link=${encodedLink}`);
            
            if (response?.data?.success) {
                return { interviewLink, data: response.data };
            } else {
                return rejectWithValue(response.data);
            }
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

const initialState = {
    results: {}, // Map of interviewLink -> result data
    loading: false,
    error: null
}

const InterviewResultSlice = createSlice({
    name: "interviewResult",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getInterviewResult.pending, (state) => {
                state.loading = true;
            })
            .addCase(getInterviewResult.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.results[payload.interviewLink] = payload.data;
            })
            .addCase(getInterviewResult.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            });
    }
});

export default InterviewResultSlice.reducer;
