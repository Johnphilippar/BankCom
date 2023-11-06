import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/auth';
import alertReducer from './reducers/alert';
import profileReducer from './reducers/profile';

const store = configureStore({
  reducer: {
    alert: alertReducer,
    auth: authReducer,
    profile: profileReducer,
  }
});

export default store;