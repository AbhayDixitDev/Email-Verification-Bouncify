import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios, { endpoints } from 'src/utils/axios';

// Define the async thunk for fetching credits history
export const fetchCreditsHistory = createAsyncThunk(
    'credits/fetchCreditsHistory',
    async (params = {}, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(endpoints.credit.getHistory, { params });
            return data?.data || [];
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Define the async thunk for fetching credits balance
export const fetchCreditBalance = createAsyncThunk(
    'credits/fetchCreditsBalance', // Action type
    async (_, thunkAPI) => {
        try {
            const { data } = await axios.get(endpoints.credit.getBalance);
            return data?.data; // Fulfilled action payload
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || 'Something went wrong');
        }
    }
);

// Create the slice
const creditSlice = createSlice({
    name: 'credits',
    initialState: {
        history: {
            data: [],
        },
        totalCredits: 0,
        usedCredits: 0,
        remainingCredits: 0,
        loading: false,
        error: null,
    },
    reducers: {
        deductCredit: (state, action) => {
            const { amount } = action.payload;

            if (state.remainingCredits >= amount) {
                state.remainingCredits -= amount;
                state.usedCredits += amount;

                // Update history
                state.history.data.push({
                    amount,
                    type: 'DEDUCTION',
                    description: action.payload.description || 'Credit deducted',
                    status: 'DEDUCTED',
                    createdAt: new Date().toISOString(),
                });
            } else {
                state.error = 'Insufficient credits';
            }

        }
    }, // You can add synchronous actions if needed
    extraReducers: (builder) => {
        builder
            // Fetch credits history
            .addCase(fetchCreditsHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCreditsHistory.fulfilled, (state, action) => {
                state.loading = false;
                // Handle the API response structure
                const { data, totalCredits, page, creditsPerPage } = action.payload;
                state.history = {
                    data: Array.isArray(data) ? data : [],
                    total: totalCredits || 0,
                    page: page || 1,
                    limit: creditsPerPage || 10
                };
                // Also update the total credits
                state.totalCredits = totalCredits || 0;
                console.log('History data set:', state.history);
            })
            .addCase(fetchCreditsHistory.rejected, (state, action) => {
                state.status = false;
                state.error = action.payload;
            })
            // Fetch credits balance
            .addCase(fetchCreditBalance.pending, (state) => {
                state.status = true;
                state.error = null;
            })
            .addCase(fetchCreditBalance.fulfilled, (state, action) => {
                state.status = false;
                state.totalCredits = action?.payload?.totalCredits;
                state.usedCredits = action?.payload?.usedCredits;
                state.remainingCredits = action?.payload?.remainingCredits;
            })
            .addCase(fetchCreditBalance.rejected, (state, action) => {
                state.status = false;
                state.error = action.payload;
            });
    },
});

export const { deductCredit } = creditSlice.actions;
export default creditSlice.reducer;
