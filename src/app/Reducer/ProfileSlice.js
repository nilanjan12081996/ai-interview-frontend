import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../store/Api";

const PROFILE_BASE_URL = import.meta.env.VITE_PROFILE_API_URL;

export const getProfile = createAsyncThunk(
    'profile/getProfile',
    async (_, { rejectWithValue }) => {
        try {
            const role = sessionStorage.getItem("role");
            const url = role === "SUPER_ADMIN" ? '/api/profile/get' : '/api/profile/get/hr';
            const response = await api.get(url, { baseURL: PROFILE_BASE_URL });
            if (response?.data?.statusCode === 200) {
                return response.data;
            } else {
                return rejectWithValue(response.data);
            }
        } catch (err) {
            return rejectWithValue(err.response?.data || err);
        }
    }
);

export const updateProfile = createAsyncThunk(
    'profile/updateProfile',
    async (userInput, { rejectWithValue }) => {
        try {
            const role = sessionStorage.getItem("role");
            const url = role === "SUPER_ADMIN" ? '/api/profile/update' : '/api/profile/update/hr';
            const response = await api.patch(url, userInput, { baseURL: PROFILE_BASE_URL });
            if (response?.data?.statusCode === 200) {
                return response.data;
            } else {
                return rejectWithValue(response.data);
            }
        } catch (err) {
            return rejectWithValue(err.response?.data || err);
        }
    }
);

export const updateAvatar = createAsyncThunk(
    'profile/updateAvatar',
    async (formData, { rejectWithValue }) => {
        try {
            const role = sessionStorage.getItem("role");
            const url = role === "SUPER_ADMIN" ? '/api/profile/update-avatar' : '/api/profile/update-avatar/hr';
            const response = await api.patch(url, formData, { baseURL: PROFILE_BASE_URL });
            if (response?.data?.statusCode === 200) {
                return response.data;
            } else {
                return rejectWithValue(response.data);
            }
        } catch (err) {
            return rejectWithValue(err.response?.data || err);
        }
    }
);

const initialState = {
    profileData: null,
    loading: false,
    error: null,
    updateLoading: false,
    updateAvatarLoading: false,
};

const ProfileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        clearProfile: (state) => {
            state.profileData = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProfile.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.profileData = payload.data;
            })
            .addCase(getProfile.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            .addCase(updateProfile.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state) => {
                state.updateLoading = false;
            })
            .addCase(updateProfile.rejected, (state, { payload }) => {
                state.updateLoading = false;
                state.error = payload;
            })
            .addCase(updateAvatar.pending, (state) => {
                state.updateAvatarLoading = true;
                state.error = null;
            })
            .addCase(updateAvatar.fulfilled, (state, { payload }) => {
                state.updateAvatarLoading = false;
                if(state.profileData) {
                    state.profileData.avatarUrl = payload.avatarUrl;
                }
            })
            .addCase(updateAvatar.rejected, (state, { payload }) => {
                state.updateAvatarLoading = false;
                state.error = payload;
            });
    }
});

export const { clearProfile } = ProfileSlice.actions;
export default ProfileSlice.reducer;
