import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const getPeople = createAsyncThunk(
    'social/getPeople',
    async ({ page, size, minAge, maxAge, gender, bodyType, location }, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            const token = auth.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` },
                params: { page, size, minAge, maxAge, gender, bodyType, location }
            };
            const response = await axios.get(`${BASE_URL}/auth/discover`, config);
            if (response.data.status === "failed") {
                return rejectWithValue(response.data.message);
            }
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message || error.response.data.errors);
            }
            return rejectWithValue({ message: error.message });
        }
    }
);

export const likeUser = createAsyncThunk(
    'social/likeUser',
    async ({ likedUserId }, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            const token = auth.token;
            const response = await axios.post(`${BASE_URL}/auth/like/${likedUserId}`, {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.status === "failed") {
                return rejectWithValue(response.data.message);
            }
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message || error.response.data.errors);
            }
            return rejectWithValue({ message: error.message });
        }
    }
);

export const fetchMessages = createAsyncThunk(
    'social/fetchMessages',
    async ({ senderId, receiverId }, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const token = auth.token;
            const response = await axios.get(`${BASE_URL}/auth/get-message/${senderId}/${receiverId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const sendMessage = createAsyncThunk(
    'social/sendMessage',
    async ({ senderId, receiverId, content }, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const token = auth.token;
            const response = await axios.post(`${BASE_URL}/auth/send-message`,
                { senderId, receiverId, content },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getMatchUser = createAsyncThunk(
    'social/getMatchUser',
    async (_, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            const token = auth.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const response = await axios.get(`${BASE_URL}/auth/get-match-users`, config);
            if (response.data.status === "failed") {
                return rejectWithValue(response.data.message);
            }
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message || error.response.data.errors);
            }
            return rejectWithValue({ message: error.message });
        }
    }
);

export const getLikeUser = createAsyncThunk(
    'social/getLikeUser',
    async (_, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            const token = auth.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const response = await axios.get(`${BASE_URL}/auth/get-like-users`, config);
            if (response.data.status === "failed") {
                return rejectWithValue(response.data.message);
            }
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message || error.response.data.errors);
            }
            return rejectWithValue({ message: error.message });
        }
    }
);

const initialState = {
    people: [],
    page: 1,
    size: 20,
    totalPages: 0,
    totalResults: 0,
    pepLoading: false,
    pepError: null,

    likLoading: false,
    likError: null,

    chat: [],
    receiver: null,
    msgLoading: false,
    msgError: null,

    sendMsgError: null,
    sendMsgLoading: false,

    matchusers: [],
    matchLoading: false,
    matchError: null,

    likeusers: [],
    likeLoading: false,
    likeError: null,
};

const socialSlice = createSlice({
    name: 'social',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPeople.pending, (state) => {
                state.pepLoading = true;
                state.pepError = null;
            })
            .addCase(getPeople.fulfilled, (state, action) => {
                state.pepLoading = false;
                state.people = action.payload.people;
                state.page = action.payload.page;
                state.size = action.payload.size;
                state.totalPages = action.payload.totalPages;
                state.totalResults = action.payload.totalResults;
            })
            .addCase(getPeople.rejected, (state, action) => {
                state.pepLoading = false;
                state.pepError = action.payload || "Unknown error occurred";
            })
            .addCase(likeUser.pending, (state) => {
                state.likLoading = true;
                state.likError = null;
            })
            .addCase(likeUser.fulfilled, (state, action) => {
                state.likLoading = false;
                state.likError = action.payload.message;
            })
            .addCase(likeUser.rejected, (state, action) => {
                state.likLoading = false;
                state.likError = action.payload.message || "Unknown error occurred";
            })
            .addCase(fetchMessages.pending, (state) => {
                state.msgLoading = true;
                state.msgError = null;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.msgLoading = false;
                state.chat = action.payload.chat;
                state.receiver = action.payload.receiver;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.msgLoading = false;
                state.msgError = action.payload || "Unknown error occurred";
            })
            .addCase(sendMessage.pending, (state) => {
                state.sendMsgError = null;
                state.sendMsgLoading = true;
            })
            .addCase(sendMessage.fulfilled, (state) => {
                state.sendMsgError = null;
                state.sendMsgLoading = false;
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.sendMsgError = action.payload || "Unknown error occurred";
                state.sendMsgLoading = false;
            })
            .addCase(getMatchUser.pending, (state) => {
                state.matchLoading = true;
                state.matchError = null;
            })
            .addCase(getMatchUser.fulfilled, (state, action) => {
                state.matchLoading = false;
                state.matchError = null;
                state.matchusers = action.payload.matchusers;
            })
            .addCase(getMatchUser.rejected, (state, action) => {
                state.matchLoading = false;
                state.matchError = action.payload || "Unknown error occurred";
            })
            .addCase(getLikeUser.pending, (state) => {
                state.likeLoading = true;
                state.likeError = null;
            })
            .addCase(getLikeUser.fulfilled, (state, action) => {
                state.likeLoading = false;
                state.likeError = null;
                state.likeusers = action.payload.likeusers;
            })
            .addCase(getLikeUser.rejected, (state, action) => {
                state.likeLoading = false;
                state.likeError = action.payload || "Unknown error occurred";
            });
    },
});

export default socialSlice.reducer;