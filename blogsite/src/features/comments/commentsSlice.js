import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

let initialState = {
    comments: [],
    status: 'idle',
    error: null
}

const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {},
});

export const createComment = createAsyncThunk(
  "comments/create",
  async ( inputComment, thunkAPI) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/createComment`,
        {
          method: "POST",
          body: JSON.stringify(inputComment),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        }
      );
      if (!response.ok) { throw new Error("Failed to create comment"); }
      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export default commentSlice.reducer;