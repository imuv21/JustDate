import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;


export const signupUser = createAsyncThunk(
    'auth/signupUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/v1/public/signup`, userData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;

        } catch (error) {
            if (error.response && error.response.data) {
                if (error.response.data.message) {
                    return rejectWithValue({ message: error.response.data.message });
                }
                return rejectWithValue(error.response.data.errors);
            }
        }
    }
);

export const verifyOtp = createAsyncThunk(
    'auth/verifyOtp',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/v1/public/verify-otp`, userData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;

        } catch (error) {
            if (error.response && error.response.data) {
                if (error.response.data.message) {
                    return rejectWithValue({ message: error.response.data.message });
                }
            }
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/v1/public/login`, userData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response.data;

        } catch (error) {
            if (error.response && error.response.data) {
                if (error.response.data.message) {
                    return rejectWithValue({ message: error.response.data.message });
                }
                return rejectWithValue(error.response.data.errors);
            }
        }
    }
);

export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/v1/public/forgot-password`, userData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response.data;

        } catch (error) {
            if (error.response && error.response.data) {
                if (error.response.data.message) {
                    return rejectWithValue({ message: error.response.data.message });
                }
                return rejectWithValue(error.response.data.errors);
            }
        }
    }
);

export const verifyPassword = createAsyncThunk(
    'auth/verifyPassword',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/v1/public/verify-password-otp`, userData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response.data;

        } catch (error) {
            if (error.response && error.response.data) {
                if (error.response.data.message) {
                    return rejectWithValue({ message: error.response.data.message });
                }
                return rejectWithValue(error.response.data.errors);
            }
        }
    }
);

export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (userData, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const token = auth.token;

            const response = await axios.patch(`${BASE_URL}/api/v1/private/update-profile`, userData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            return response.data;

        } catch (error) {
            if (error.response && error.response.data) {
                if (error.response.data.message) {
                    return rejectWithValue({ message: error.response.data.message });
                }
                return rejectWithValue(error.response.data.errors);
            }
        }
    }
);

export const updateDetails = createAsyncThunk(
    'auth/updateDetails',
    async (detailData, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const token = auth.token;

            const response = await axios.patch(`${BASE_URL}/api/v1/private/update-details`, detailData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            return response.data;

        } catch (error) {
            if (error.response && error.response.data) {
                if (error.response.data.message) {
                    return rejectWithValue({ message: error.response.data.message });
                }
                return rejectWithValue(error.response.data.errors);
            }
        }
    }
);


const initialState = {

    user: null,
    token: null,
    logLoading: false,
    logErrors: null,
    logError: null,

    signupData: null,
    signLoading: false,
    signErrors: null,
    signError: null,

    otpLoading: false,
    otpError: null,

    emailData: null,
    fopaLoading: false,
    fopaErrors: null,
    fopaError: null,

    vepaLoading: false,
    vepaErrors: null,
    vepaError: null,

    upLoading: false,
    upError: null,
    upGenErrors: null,

    details: {
        age: null,
        height: null,
        location: '',
        profession: '',
        gender: '',
        drinking: '',
        smoking: '',
        haveKids: '', 
        lookingFor: '', 
        datingType: '',
        relationshipStatus: '',
        eatingHabit: '',
        bodyType: ''
    },
    detLoading: false,
    detError: null,
    detGenErrors: null,

    upshowLoading: false,
    upshowErrors: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.signErrors = null;
            state.signError = null;
            state.logErrors = null;
            state.logError = null;
            state.otpError = null;
            state.fopaErrors = null;
            state.fopaError = null;
            state.vepaErrors = null;
            state.vepaError = null;
            state.upError = null;
            state.upGenErrors = null;
            state.detError = null;
            state.detGenErrors = null;
        },
        setSignupData: (state, action) => {
            state.signupData = action.payload;
        },
        setEmailData: (state, action) => {
            state.emailData = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(signupUser.pending, (state) => {
                state.signLoading = true;
                state.signErrors = null;
                state.signError = null;
            })
            .addCase(signupUser.fulfilled, (state) => {
                state.signLoading = false;
                state.signErrors = null;
                state.signError = null;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.signLoading = false;
                if (Array.isArray(action.payload)) {
                    state.signErrors = action.payload;
                } else {
                    state.signError = action.payload?.message || "Something went wrong!";
                }
            })

            .addCase(verifyOtp.pending, (state) => {
                state.otpLoading = true;
                state.otpError = null;
            })
            .addCase(verifyOtp.fulfilled, (state) => {
                state.otpLoading = false;
                state.otpError = null;
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.otpLoading = false;
                state.otpError = action.payload?.message || "Something went wrong!";
            })

            .addCase(loginUser.pending, (state) => {
                state.logLoading = true;
                state.logErrors = null;
                state.logError = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.logLoading = false;
                state.logErrors = null;
                state.logError = null;
                state.user = action.payload?.user || null;
                state.token = action.payload?.token || null;
                state.details = action.payload?.user?.details || null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.logLoading = false;
                if (Array.isArray(action.payload)) {
                    state.logErrors = action.payload;
                } else {
                    state.logError = action.payload?.message || "Something went wrong!";
                }
            })

            .addCase(forgotPassword.pending, (state) => {
                state.fopaLoading = true;
                state.fopaErrors = null;
                state.fopaError = null;
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.fopaLoading = false;
                state.fopaErrors = null;
                state.fopaError = null;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.fopaLoading = false;
                if (Array.isArray(action.payload)) {
                    state.fopaErrors = action.payload;
                } else {
                    state.fopaError = action.payload?.message || "Something went wrong!";
                }
            })

            .addCase(verifyPassword.pending, (state) => {
                state.vepaLoading = true;
                state.vepaErrors = null;
                state.vepaError = null;
            })
            .addCase(verifyPassword.fulfilled, (state) => {
                state.vepaLoading = false;
                state.vepaErrors = null;
                state.vepaError = null;
            })
            .addCase(verifyPassword.rejected, (state, action) => {
                state.vepaLoading = false;
                if (Array.isArray(action.payload)) {
                    state.vepaErrors = action.payload;
                } else {
                    state.vepaError = action.payload?.message || "Something went wrong!";
                }
            })

            .addCase(updateProfile.pending, (state) => {
                state.upLoading = true;
                state.upError = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.upLoading = false;
                state.user = {
                    ...state.user,
                    firstName: action.payload.user.firstName,
                    lastName: action.payload.user.lastName,
                    interests: action.payload.user.interests,
                    links: action.payload.user.links
                };
                state.upError = null;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.upLoading = false;
                if (Array.isArray(action.payload)) {
                    state.upError = action.payload;
                } else {
                    state.upGenErrors = action.payload?.message || "Unknown error occurred";
                }
            })

            .addCase(updateDetails.pending, (state) => {
                state.detLoading = true;
                state.detError = null;
            })
            .addCase(updateDetails.fulfilled, (state, action) => {
                state.detLoading = false;
                state.details = {
                    age: action.payload.user.details.age,
                    height: action.payload.user.details.height,
                    location: action.payload.user.details.location,
                    profession: action.payload.user.details.profession,
                    gender: action.payload.user.details.gender,
                    drinking: action.payload.user.details.drinking,
                    smoking: action.payload.user.details.smoking,
                    haveKids: action.payload.user.details.haveKids,
                    lookingFor: action.payload.user.details.lookingFor,
                    datingType: action.payload.user.details.datingType,
                    relationshipStatus: action.payload.user.details.relationshipStatus,
                    eatingHabit: action.payload.user.details.eatingHabit,
                    bodyType: action.payload.user.details.bodyType
                };
                state.detError = null;
            })
            .addCase(updateDetails.rejected, (state, action) => {
                state.detLoading = false;
                if (Array.isArray(action.payload)) {
                    state.detError = action.payload;
                } else {
                    state.detGenErrors = action.payload?.message || "Unknown error occurred";
                }
            })
    }
});

export const { clearErrors, setSignupData, setEmailData, logout } = authSlice.actions;
export default authSlice.reducer;
