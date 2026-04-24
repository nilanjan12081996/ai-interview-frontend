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

// export const scheduleInterview = createAsyncThunk(
//     'scheduleInterview',
//     async (userInput,{coding,interview}, { rejectWithValue }) => {

//         try {
//             const response = await api.post(`/interview/schedule?coding=${coding}interview=${interview}`,userInput);
//             if (response?.data?.statusCode === 201) {
//                 return response.data;
//             } else {
//                 return rejectWithValue(response.data);
//             }
//         } catch (err) {
//             // let errors = errorHandler(err);
//             return rejectWithValue(err);
//         }
//     }
// )


export const scheduleInterview = createAsyncThunk(
    'scheduleInterview',
    // 1. Destructure the single payload object here
    async ({ userInput, coding, interview }, { rejectWithValue }) => {
        try {
            // 2. Added the missing '&' between coding and interview
            const url = `/interview/schedule?coding=${coding}&interview=${interview}`;

            const response = await api.post(url, userInput);

            if (response?.data?.statusCode === 201) {
                return response.data;
            } else {
                return rejectWithValue(response.data);
            }
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const generateCodingQuestions = createAsyncThunk(
    'generateCodingQuestions',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await api.post('https://api.interviewfold.com/api/coding/generate', payload);
            //  const response = await api.post('http://localhost:8085/api/coding/generate', payload);
            return response.data;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
)


// export const reScheduleInterview = createAsyncThunk(
//     'interview/reSchedule',
//     async ({ id }, { rejectWithValue }) => {
//         try {

//             const response = await api.post(`/interview/resend-link/${id}`);


//             if (response?.data?.status) {
//                 return response.data;
//             } else {
//                 return rejectWithValue(response.data || "Failed to resend link");
//             }
//         } catch (err) {

//             const errorMessage = err.response?.data?.message || err.message;
//             return rejectWithValue(errorMessage);
//         }
//     }
// );

export const reScheduleInterview = createAsyncThunk(
    'interview/reSchedule',
    async ({ id, coding, interviewData }, { rejectWithValue }) => {
        try {
            const response = await api.post(
                `/interview/resend-link/${id}/${coding}/${interviewData}`
            );
            if (response?.data?.status) {
                return response.data;
            } else {
                return rejectWithValue(response.data || "Failed to resend link");
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            return rejectWithValue(errorMessage);
        }
    }
);


// --- NEW THUNK FOR DELETE ---
export const deleteCandidate = createAsyncThunk(
    'interview/delete',
    async ({ id }, { rejectWithValue }) => {
        try {
            // Delete method with query param: ?id={id}
            const response = await api.delete(`/interview/delete?interviewScheduleId=${id}`);

            if (response?.data?.statusCode === 200 || response?.data?.status) {
                return response.data;
            } else {
                return rejectWithValue(response.data || "Failed to delete");
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            return rejectWithValue(errorMessage);
        }
    }
);

// --- NEW THUNK FOR UPDATE ---
export const updateCandidate = createAsyncThunk(
    'interview/update',
    async ({ id, userInput }, { rejectWithValue }) => {
        try {
            // Patch method with path param: /update/{id}
            const response = await api.patch(`/interview/update/${id}`, userInput);

            if (response?.data?.statusCode === 200 || response?.data?.status) {
                return response.data;
            } else {
                return rejectWithValue(response.data || "Failed to update");
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            return rejectWithValue(errorMessage);
        }
    }
);


const initialState = {
    loading: false,
    candidatesList: [],
    error: false,
    scheduleInterviewData: "",
    reScheduleInterviewData: "",
    deleteCandidateData: "",
    updateCandidateData: ""
}
const CandidateSlice = createSlice({
    name: "candidate",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCandidateData.pending, (state) => {
                state.loading = true
            })
            .addCase(getCandidateData.fulfilled, (state, { payload }) => {
                state.loading = false
                state.candidatesList = payload
                state.error = false
            })
            .addCase(getCandidateData.rejected, (state, { payload }) => {
                state.loading = false
                state.error = payload
            })
            .addCase(scheduleInterview.pending, (state) => {
                state.loading = true
            })
            .addCase(scheduleInterview.fulfilled, (state, { payload }) => {
                state.loading = false
                state.scheduleInterviewData = payload
                state.error = false
            })
            .addCase(scheduleInterview.rejected, (state, { payload }) => {
                state.loading = false
                state.error = payload
            })
            .addCase(reScheduleInterview.pending, (state) => {
                state.loading = true
            })
            .addCase(reScheduleInterview.fulfilled, (state, { payload }) => {
                state.loading = false
                state.reScheduleInterviewData = payload
                state.error = false
            })
            .addCase(reScheduleInterview.rejected, (state, { payload }) => {
                state.loading = false
                state.error = payload
            })

            // Delete Candidate
            .addCase(deleteCandidate.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteCandidate.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.deleteCandidateData = payload;
                state.error = false;
            })
            .addCase(deleteCandidate.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })

            // Update Candidate
            .addCase(updateCandidate.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateCandidate.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.updateCandidateData = payload;
                state.error = false;
            })
            .addCase(updateCandidate.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            });
    }
})
export default CandidateSlice.reducer