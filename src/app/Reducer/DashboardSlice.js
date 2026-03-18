import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../store/Api";
export const dashboardCount = createAsyncThunk(
    'dashboardCount',
    async (_, { rejectWithValue }) => {

        try {
            const response = await api.get('/dashboard/metrics');
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

export const dashboardRecentActivity = createAsyncThunk(
    'dashboardRecentActivity',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/dashboard/recent-activity');
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
const initialState = {
    loading: false,
    dashboardData: [],
    recentActivityData: [],
    error: false
}
const DashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(dashboardCount.pending, (state) => {
                state.loading = true
            })
            .addCase(dashboardCount.fulfilled, (state, { payload }) => {
                state.loading = false
                state.dashboardData = payload?.data
                state.error = false
            })
            .addCase(dashboardCount.rejected, (state, { payload }) => {
                state.loading = false
                state.error = payload
            })
            .addCase(dashboardRecentActivity.pending, (state) => {
                state.loading = true
            })
            .addCase(dashboardRecentActivity.fulfilled, (state, { payload }) => {
                state.loading = false
                state.recentActivityData = payload?.data
            })
            .addCase(dashboardRecentActivity.rejected, (state, { payload }) => {
                state.loading = false
                state.error = payload
            })
    }
})
export default DashboardSlice.reducer