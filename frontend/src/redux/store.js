// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';

import listNameReducer from './slice/listNameSlice';
import fileUploadReducer from './slice/upload-slice';
import userReducer from "./slice/userSlice"
import listReducer from './slice/listSlice'
import creditReducer from './slice/creditSlice'
import timeZoneReducer from './slice/timeZoneSlice';
import activityLogReducer from './slice/activityLogSlice';

export const store = configureStore({
  reducer: {
    fileUpload: fileUploadReducer,
    listName: listNameReducer,
    user: userReducer,
    credits: creditReducer,
    list: listReducer,
    timeZone: timeZoneReducer,
    activityLog: activityLogReducer,
  },
});

export default store;
