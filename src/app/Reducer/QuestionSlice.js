import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../store/Api";

export const getQuestion=createAsyncThunk(
    'getQuestion',
     async ({token}, { rejectWithValue }) => {

        try {
            const response = await api.get(`/question/get-question/${token}`);
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

// export const createSession=createAsyncThunk(
//     'createSession',
//      async (userInput, { rejectWithValue }) => {

//         try {
//             const response = await api.post(`/question/openai/session`,userInput);
//             if (response?.data?.statusCode === 200) {
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


export const createSession = createAsyncThunk(
  "questions/createSession",
  async (userInput, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/question/openai/session`,
        userInput
      );

      // Axios only reaches here if status is 2xx
      return response.data;

    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Session creation failed"
      );
    }
  }
);
const initialState={
    loading:false,
    error:false,
    allquestions:[],
    clientKey:""

}
const QuestionSlice=createSlice(
    {
        "name":"questions",
        initialState,
        reducers:{},
        extraReducers:(builder)=>{
            builder
            .addCase(getQuestion.pending,(state)=>{
                state.loading=true

            })
            .addCase(getQuestion.fulfilled,(state,{payload})=>{
                state.loading=false
                state.allquestions=payload?.questions
                state.error=false
            })
            .addCase(getQuestion.rejected,(state,{payload})=>{
                state.loading=false
                state.error=payload
            })
            .addCase(createSession.pending,(state)=>{
                state.loading=true

            })
            .addCase(createSession.fulfilled,(state,{payload})=>{
                state.loading=false
                state.clientKey=payload
                state.error=false
            })
            .addCase(createSession.rejected,(state,{payload})=>{
                state.loading=false
                state.error=payload
            })
        }
    }
)
export default QuestionSlice.reducer;