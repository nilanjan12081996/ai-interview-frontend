import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../store/Api";

export const login = createAsyncThunk(
    'auth/login',
    async (userInput, { rejectWithValue }) => {

        try {
            const response = await api.post('/superadmin/login', userInput);
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


//init state

const initialState = {
    message: null,
    error: null,
    loading: false,
    isLoggedIn: false,
    currentUser: {},
    subdomain: [],
    loadingLogin: false,
}



//slice part
const AuthSlice = createSlice(
    {
        name: 'auth',
        initialState,
        reducers: {

            clearCurrentUser: (state) => {
                state.currentUser = {};
            },
            resetAfterLoggedIn: (state) => {
                state = { ...initialState, isLoggedIn: true };
            },

            logout: (state) => {
                state.isLoggedIn = false;
                state.currentUser = {};
                state.message = null;
                state.error = null
                sessionStorage.removeItem('ai_interview_token')
               
                localStorage.clear()

            }
        },
        extraReducers: (builder) => {
            builder
                .addCase(login.pending, (state) => {
                    state.loadingLogin = true;
                    state.isLoggedIn = false;
                    state.error = false;
                })
                .addCase(login.fulfilled, (state, { payload }) => {

                    console.log("Payload", payload);
                    state.isLoggedIn = true;

                    state.message = payload?.message;
                    state.loadingLogin = false;

                    sessionStorage.setItem(
                        'ai_interview_token',
                        JSON.stringify({ token: payload?.token })
                    )
                    // localStorage.setItem('user_role_id', payload?.role_id)
                    // localStorage.setItem("user_short_name", payload?.role_short_name)

                })

                .addCase(login.rejected, (state, response) => {
                    // console.log("Payload: ", payload);
                    state.error = true;
                    state.loadingLogin = false;
                    state.message =
                        response !== undefined && response
                            ? response
                            : 'Something went wrong. Try again later.';
                })
                
        }
    }
)

export const { resetAfterLoggedIn, clearCurrentUser, logout } = AuthSlice.actions;
export default AuthSlice.reducer