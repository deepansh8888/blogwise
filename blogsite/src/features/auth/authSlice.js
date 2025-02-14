import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

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
      localStorage.removeItem('userProfileInfo');
    },
    restoreAuth: (state) => {
      state.isAuthenticated = !!state.token; // Set isAuthenticated to true if token exists, false otherwise
    },
  },
  extraReducers: (builder)=>{
    builder
    .addCase(loginCall.fulfilled, (state, action)=>{
      localStorage.setItem("userProfileInfo", JSON.stringify(action.payload.userProfile));
    })
  }
});

// Here, i tried using dispatch inside the slice only
// I could have just created extraReducers and then usign builder.addCase which is best practice i think
export const loginCall = createAsyncThunk('auth/login',
  async( userInfo , { dispatch, rejectWithValue })=>{
    try{
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/login`, {
        method: "POST",
        body: JSON.stringify(userInfo),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      if(!response.ok) throw new Error(`Failed to Login ${response.status}` ); 

     dispatch(
        loginSuccess({
          username: userInfo.username,
          token: data.token,
        })
      );
      return data;
    }catch(error){
      return rejectWithValue(error.message);
    }
  }
);

  export const registerCall = createAsyncThunk(
    "auth/register",
    async (regData, thunkAPI) => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/register`,
          {
            method: "POST",
            body: JSON.stringify(regData),
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error(response.status);

       return await response.json();
      } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );

// Action creators are generated for each case reducer function
export const { loginSuccess, restoreAuth, logout } = authSlice.actions;

export default authSlice.reducer;
