import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import toggleReducer from '../features/toggle/toggleSlice'

export const store = configureStore({

  reducer: {
    auth: authReducer,
    toggle: toggleReducer
    
  }
})