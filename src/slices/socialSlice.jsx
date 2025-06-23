import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;


export const getPeople = createAsyncThunk(
    'social/getPeople',
    async ({ minAge, maxAge, minHeight, maxHeight, location, profession, gender, drinking, smoking, haveKids, lookingFor, datingType, relationshipStatus, eatingHabit, bodyType, interests, page, size, sortBy = "firstName", order }, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            const token = auth.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` },
                params: { minAge, maxAge, minHeight, maxHeight, location, profession, gender, drinking, smoking, haveKids, lookingFor, datingType, relationshipStatus, eatingHabit, bodyType, interests, page, size, sortBy, order }
            };
            const response = await axios.get(`${BASE_URL}/api/v1/private/discover`, config);
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
            const response = await axios.post(`${BASE_URL}/api/v1/private/like/${likedUserId}`, {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data;

        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message || error.response.data.errors);
            }
            return rejectWithValue({ message: error.message });
        }
    }
);

export const unmatch = createAsyncThunk(
    'social/unmatch',
    async ({ unmatchedUserId }, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            const token = auth.token;
            const response = await axios.post(`${BASE_URL}/api/v1/private/unlike/${unmatchedUserId}`, {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
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
            const response = await axios.get(`${BASE_URL}/api/v1/private/get-message/${senderId}/${receiverId}`,
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
            const response = await axios.post(`${BASE_URL}/api/v1/private/send-message`,
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
            console.log('🔍 getMatchUser thunk triggered');

            const { auth } = getState();
            const token = auth.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const response = await axios.get(`${BASE_URL}/api/v1/private/get-match-users`, config);
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
            const response = await axios.get(`${BASE_URL}/api/v1/private/get-like-users`, config);
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
    totalResults: 0,
    totalPages: 0,
    pagePeople: 0,
    isFirst: false,
    isLast: false,
    hasNext: false,
    hasPrevious: false,
    pepLoading: false,
    pepError: null,

    likLoading: false,
    likError: null,

    unmatchLoading: false,
    unmatchError: null,

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
                state.pepError = null;
                state.people = action.payload.people;
                state.totalResults = action.payload.totalResults;
                state.totalPages = action.payload.totalPages;
                state.pagePeople = action.payload.pagePeople;
                state.isFirst = action.payload.isFirst;
                state.isLast = action.payload.isLast;
                state.hasNext = action.payload.hasNext;
                state.hasPrevious = action.payload.hasPrevious;
            })
            .addCase(getPeople.rejected, (state, action) => {
                state.pepLoading = false;
                state.pepError = action.payload || "Unknown error occurred!";
            })
            .addCase(likeUser.pending, (state) => {
                state.likLoading = true;
                state.likError = null;
            })
            .addCase(likeUser.fulfilled, (state) => {
                state.likLoading = false;
                state.likError = null;
            })
            .addCase(likeUser.rejected, (state, action) => {
                state.likLoading = false;
                state.likError = action.payload.message || "Unknown error occurred!";
            })
            .addCase(unmatch.pending, (state) => {
                state.unmatchLoading = true;
                state.unmatchError = null;
            })
            .addCase(unmatch.fulfilled, (state, action) => {
                state.unmatchLoading = false;
                state.unmatchError = null;
                const { unmatchedUserId } = action.meta.arg;
                state.matchusers = state.matchusers.filter((user) => user._id !== unmatchedUserId);
            })
            .addCase(unmatch.rejected, (state, action) => {
                state.unmatchLoading = false;
                state.unmatchError = action.payload.message || "Unknown error occurred!";
            })
            .addCase(fetchMessages.pending, (state) => {
                state.msgLoading = true;
                state.msgError = null;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.msgLoading = false;
                state.msgError = null;
                state.chat = action.payload.chat;
                state.receiver = action.payload.receiver;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.msgLoading = false;
                state.msgError = action.payload || "Unknown error occurred!";
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
                state.sendMsgError = action.payload || "Unknown error occurred!";
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
                state.matchError = action.payload || "Unknown error occurred!";
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
                state.likeError = action.payload || "Unknown error occurred!";
            });
    },
});

export default socialSlice.reducer;