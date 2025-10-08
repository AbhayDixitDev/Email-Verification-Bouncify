import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// eslint-disable-next-line import/no-unresolved
import axiosInstance, { endpoints } from 'src/utils/axios';

import { deductCredit } from './creditSlice';


export const fetchLists = createAsyncThunk('list/fetchLists',
  async (params = {}) => {
    try {
      const response = await axiosInstance.get(endpoints.list.get, {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search || '',
          status: params.status || ''
        }
      });
      
      return {
        data: response.data.data.listData || [],
        pagination: {
          total: response.data.data.total || 0,
          page: response.data.data.page || 1,
          limit: response.data.data.limit || 10,
          totalPages: response.data.data.totalPages || 1
        },
        stats: response.data.data.stats || {}
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch lists');
    }
  }
);

export const uploadList = createAsyncThunk(
  'list/uploadList',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axiosInstance.post(endpoints.list.upload, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data; // { success, message, data: fileDoc }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const searchLists = createAsyncThunk(
  'list/search',
  async (searchQuery = '') => {
    try {
      const response = await axiosInstance.get(endpoints.list.get, {
        params: { search: searchQuery, limit: 100 }
      });

      return {
        data: response.data.data,
        stats: response.data.data.stats,
      };
    } catch (error) {
      throw error.message;
    }
  }
);
export const fetchListById = createAsyncThunk('list/getList', async (listId) => {
  try {
    const response = await axiosInstance.get(`${endpoints.list.get}/${listId}`)

    return response.data.data
  } catch (error) {
    return error.message
  }
})

export const downloadList = createAsyncThunk(
  'list/downloadList',
  async ({ jobId, downloadType }, { rejectWithValue }) => {
    try {
      // console.log(jobId,downloadType)
      // Make a GET request to download the file
      // console.log(`${endpoints.list.download}/${jobId}?type=${downloadType}`)
      const response = await axiosInstance.get(`${endpoints.list.download}/${jobId}?type=${downloadType}`, {
        responseType: 'blob', // Important for handling file data
      });
      // console.log(response)
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `download_${jobId}.csv`; // You can customize the filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      // Return a simple success flag instead of the Blob
      return { success: true, jobId };
    } catch (error) {
      // Return error message if the download fails
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteList = createAsyncThunk(
  'list/deleteList',
  async ({ jobId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(endpoints.list.delete, {
        data: {
          jobId,
        },
      });
      return response.data; // Return the server's response for success
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchChartValues = createAsyncThunk(
  'list/fetchChartValues',
  async () => {
    try {
      const response = await axiosInstance.get(endpoints.list.chart)
      return response?.data?.data;
    } catch (error) {
      return error.message;
    }
  }
)


export const startBulkVerification = createAsyncThunk(
  'list/startVerification',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(endpoints.list.startBulkVerification, {
        jobId,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const pollJobStatus = createAsyncThunk(
  'list/pollJobStatus',
  async ({ jobId }, { dispatch, rejectWithValue }) => {
    const poll = async (resolve, reject) => {
      try {
        const response = await axiosInstance.get(endpoints.list.getStatus, { params: { jobId } });
        const { status } = response.data.data;
        if (status === 'COMPLETED' || status === 'FAILED') {
          if (status === 'COMPLETED') {
            dispatch(deductCredit({ amount: response?.data?.data?.totalEmails }))
          }
          dispatch(fetchLists());
          resolve(response.data);
        } else if (status === 'UNPROCESSED') {
          // keep polling until it becomes ready -> start -> verifying -> completed
          // setTimeout(() => poll(resolve, reject), 4000);
          dispatch(fetchLists());
          throw new Error('List Verification is not completed');
        } else {
          // setTimeout(() => poll(resolve, reject), 4000);
          dispatch(fetchLists());
          throw new Error('List Verification is not completed');
        }
      } catch (error) {
        reject(rejectWithValue(error.response?.data || error.message));
      }
    };

    return new Promise(poll);
  }
);

export const bulkGetStatus = createAsyncThunk(
  'list/bulkGetStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(endpoints.list.bulkGetStatus);
      return response.data; // Ideally { success, message, data: [...] } returned from API
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


const listSlice = createSlice({
  name: 'list',
  initialState: {
    selectedListIndex: 0,
    data: {
      listData: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1
      },
      stats: {}
    },
    completedLists: [],
    unprocessedLists: [],
    processingLists: [],
    searchResults: [],
    searchQuery: '',
    stats: {},
    chartValues: {},
    selectedList: {},
    verificationResult: null,
    pollingJob: null, 
    loading: false,      
    error: null,         
    downloadLoading: false,  
    downloadError: null,  
    downloadedFile: null,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearSearch: (state) => {
      state.searchQuery = '';
      state.searchResults = [];
    },
    setSelectedListIndex: (state, action) => {
      // console.log(action.payload);
      state.selectedListIndex = action.payload;
    },
    setSelectedList: (state, action) => {
      // console.log(action.payload);

      state.selectedList = action.payload;
    },
    setList: (state, action) => {
      state.data.listData = action.payload;
    },
    setCompletedList: (state, action) => {
      state.completedLists = action.payload;
    },
    setUnprocessedList: (state, action) => {
      // console.log(action.payload);
      state.unprocessedLists = action.payload;
    },
    setChartValues: (state, action) => {
      state.chartValues = action.payload;
    }
  }, extraReducers: (builder) => {

    builder
    .addCase(bulkGetStatus.pending, (state) => {
    state.loading = true;
    state.error = null;
    })
    .addCase(bulkGetStatus.fulfilled, (state, action) => {
    state.loading = false;
    // Assuming response.data is updated list array from backend
    const updatedLists = action.payload?.data || [];
    state.data.listData = updatedLists;

    // Optionally re-calculate filtered lists
    state.completedLists = updatedLists.filter(list => list?.status === 'COMPLETED');
    state.unprocessedLists = updatedLists.filter(list => list?.status === 'UNPROCESSED');
    state.processingLists = updatedLists.filter(list => list?.status === 'PROCESSING');

    // Reset selectedList if needed
    if (state.completedLists.length > 0) {
      state.selectedList = state.completedLists[0];
    }
  })
  .addCase(bulkGetStatus.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload || action.error.message;
  })

      // upload list
      .addCase(uploadList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLists.fulfilled, (state, action) => {
        state.loading = false;
        state.data.listData = action.payload.data;
        state.data.pagination = action.payload.pagination;
        state.data.stats = action.payload.stats;
        
        // Update filtered lists
        state.completedLists = action.payload.data.filter(list => list?.status === 'COMPLETED');
        state.unprocessedLists = action.payload.data.filter(list => list?.status === 'UNPROCESSED');
        state.processingLists = action.payload.data.filter(list => list?.status === 'PROCESSING');
        
        if (state.completedLists.length > 0) {
          state.selectedList = state.completedLists[0];
        }
      })
      .addCase(uploadList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchLists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      
      .addCase(fetchLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchChartValues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChartValues.fulfilled, (state, action) => {
        state.loading = false;
        state.chartValues = action.payload;
      })
      .addCase(fetchChartValues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchListById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedList = action.payload;
      })
      .addCase(fetchListById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // verification
      .addCase(startBulkVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.verificationResult = null;
      })
      .addCase(startBulkVerification.fulfilled, (state, action) => {
        state.loading = false;
        state.verificationResult = action.payload;
      })
      .addCase(startBulkVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 
      .addCase(pollJobStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(pollJobStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedList = state.data.listData.map((list) =>
          list.jobId === action.payload.data.jobId ? { ...list, status: action?.payload?.data?.status } : list
        );
        state.data.listData = updatedList;
        state.pollingJob = null; // Reset current polling job
      })
      .addCase(pollJobStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.pollingJob = null; // Reset current polling job
      })
      // download file 
      .addCase(downloadList.pending, (state) => {
        state.downloadLoading = true;
        state.downloadError = null;
      })
      .addCase(downloadList.fulfilled, (state, action) => {
        state.downloadLoading = false;
        state.lastDownloadedJobId = action.payload.jobId;
      })
      .addCase(downloadList.rejected, (state, action) => {
        state.downloadLoading = false;
        state.downloadError = action.payload;
      })
      // search list
      .addCase(searchLists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchLists.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.data;
      })
      .addCase(searchLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { lists, setSelectedListIndex, setList, setSelectedList, setChartValues, unprocessedLists, completedLists, setCompletedList, setUnprocessedList, clearSearch, setSearchQuery } = listSlice.actions;
export default listSlice.reducer;