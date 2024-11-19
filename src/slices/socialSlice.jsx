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
            });
    },
});

export default socialSlice.reducer;