import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../store/Api";

export const getHrUser = createAsyncThunk(
    'getHrUser',
    async (_, { rejectWithValue }) => {

        try {
            const response = await api.get('/users/user-list');
            if (response?.data?.status_code === 200) {
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

export const HrUserStatusToggle = createAsyncThunk(
    'HrUserStatusToggle',
    async ({id}, { rejectWithValue }) => {

        try {
            const response = await api.get(`/users/toggle-status/${id}`);
            if (response?.data?.status_code === 200) {
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

export const createHrUser=createAsyncThunk(
    "createHrUser",
     async (userInput, { rejectWithValue }) => {

        try {
            const response = await api.post('/users/create-user',userInput);
            if (response?.data?.status_code === 201) {
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
    hrUsers:[],
    userCreateData:""
}
const HrSlice=createSlice(
    {
        name:"hr",
        initialState,
        reducers:{},
        extraReducers:(builder)=>{
            builder
            .addCase(
                getHrUser.pending,(state)=>{
                    state.loading=true
                }
            )
            .addCase(getHrUser.fulfilled,(state,{payload})=>{
                state.loading=false
                state.hrUsers=payload
                state.error=false
            })
            .addCase(getHrUser.rejected,(state,{payload})=>{
                state.loading=false
                state.error=payload
            })
                .addCase(
                createHrUser.pending,(state)=>{
                    state.loading=true
                }
            )
            .addCase(createHrUser.fulfilled,(state,{payload})=>{
                state.loading=false
                state.userCreateData=payload
                state.error=false
            })
            .addCase(createHrUser.rejected,(state,{payload})=>{
                state.loading=false
                state.error=payload
            })
        }
    }
)
export default HrSlice.reducer;