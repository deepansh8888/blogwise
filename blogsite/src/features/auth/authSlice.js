import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: localStorage.getItem("user") || null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: false,
};
// 'state' represents the current values of the properties defined in the above initialState object

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.username;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('user', action.payload.username);
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    restoreAuth: (state) => {
      state.isAuthenticated = !!state.token; // Set isAuthenticated to true if token exists, false otherwise
    },
  },
});

// Action creators are generated for each case reducer function
export const { loginSuccess, restoreAuth, logout } = authSlice.actions;

export default authSlice.reducer;
