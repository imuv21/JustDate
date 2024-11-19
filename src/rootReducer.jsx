
import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import socialSlice from './slices/socialSlice';

const rootReducer = combineReducers({
  auth: authSlice,
  social: socialSlice,
});

export default rootReducer;