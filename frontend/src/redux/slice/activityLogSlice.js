import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axiosInstance, { endpoints } from 'src/utils/axios';

// Create async thunk for fetching activity logs
export const fetchActivityLogs = createAsyncThunk(
  'activityLog/fetchActivityLogs',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(endpoints.activityLog.list, {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          module: params.module || '',
          action: params.action || '',
          source: params.source || ''
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create async thunk for fetching activity log by ID
export const fetchActivityLogById = createAsyncThunk(
  'activityLog/fetchActivityLogById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${endpoints.activityLog.get}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create async thunk for fetching activity stats
export const fetchActivityStats = createAsyncThunk(
  'activityLog/fetchActivityStats',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(endpoints.activityLog.stats, {
        params: {
          days: params.days || 30
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const activityLogSlice = createSlice({
  name: 'activityLog',
  initialState: {
    activityLogs: [],
    currentActivityLog: null,
    stats: {
      actionCounts: {},
      moduleCounts: {},
      dailyActivity: [],
      actionDistribution: [],
      moduleDistribution: []
    },
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1
    },
    filters: {
      module: '',
      action: '',
      source: ''
    },
    loading: false,
    error: null
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        module: '',
        action: '',
        source: ''
      };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch activity logs
      .addCase(fetchActivityLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivityLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.activityLogs = action.payload.data.activityLogs;
        state.pagination = {
          page: action.payload.data.page,
          limit: action.payload.data.limit,
          total: action.payload.data.total,
          totalPages: action.payload.data.totalPages
        };
        state.stats.actionCounts = action.payload.data.stats.actionCounts;
        state.stats.moduleCounts = action.payload.data.stats.moduleCounts;
      })
      .addCase(fetchActivityLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch activity log by ID
      .addCase(fetchActivityLogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivityLogById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentActivityLog = action.payload.data;
      })
      .addCase(fetchActivityLogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch activity stats
      .addCase(fetchActivityStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivityStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats.dailyActivity = action.payload.data.dailyActivity;
        state.stats.actionDistribution = action.payload.data.actionDistribution;
        state.stats.moduleDistribution = action.payload.data.moduleDistribution;
      })
      .addCase(fetchActivityStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setFilters, clearFilters, setPagination, clearError } = activityLogSlice.actions;
export default activityLogSlice.reducer;
