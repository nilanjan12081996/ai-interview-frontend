import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../store/Api";

export const getDownloadReportPdf = createAsyncThunk(
    'getDownloadReportPdf',
    async ({ token }, { rejectWithValue }) => {
        try {
            const baseUrl = import.meta.env.VITE_MAIN_API_URL || "https://api.interviewfold.com";
            const response = await api.get(`${baseUrl}/analysis/ai/${token}/data`);
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            return rejectWithValue(errorMessage);
        }
    }
);

const initialState = {
    loading: false,
    reportData: null,
    error: false,
}

const DownloadReportPdfSlice = createSlice({
    name: "downloadReportPdf",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getDownloadReportPdf.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(getDownloadReportPdf.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.reportData = payload;
                state.error = false;
            })
            .addCase(getDownloadReportPdf.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            });
    }
});

export default DownloadReportPdfSlice.reducer;
