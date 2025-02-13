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
    extraReducers: (builder) => {
        builder
        .addCase(fetchComments.fulfilled, (state, action) => {
            state.comments = action.payload;
        })
    }
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

export const fetchComments = createAsyncThunk('comments/get', 
    async(blogId, thunkAPI) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getCommentsOfBlog`, {
            method: "POST",
            body: JSON.stringify({ blogId }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            credentials: "include",
        });

        if (!response.ok) throw new Error(`Failed to fetch comments: ${response.status}`);
        const data = await response.json();
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const deleteComment = createAsyncThunk(
    'commentd/delete',
    async(commentId , thunkAPI) => {
        try{
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/deleteComment`, {
                method: 'POST',
                body: JSON.stringify({commentId: commentId}),
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials: 'include'
              });
              if(!response.ok) throw new Error(`Failed to delete comment: ${response.status}`);
              return await response.json();
        }catch(error){
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export default commentSlice.reducer;