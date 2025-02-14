import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import toggleReducer from '../features/toggle/toggleSlice'
import blogReducer from '../features/blogs/blogsSlice'
import commentReducer from '../features/comments/commentsSlice'
import userReducer from '../features/user/userSlice'

export const store = configureStore({

  reducer: {
    auth: authReducer,
    toggle: toggleReducer,
    blog: blogReducer,
    comment: commentReducer,
    user: userReducer,
  }
})