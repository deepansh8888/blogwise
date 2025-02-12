import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  blogsRefreshFlag: false,
  allBlogs: [],
  userBlogs: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
}

const blogsSlice = createSlice({
    name: 'blogs',
    initialState,
    reducers: {
      setBlogsRefresh: (state) => {
        state.blogsRefreshFlag = !state.blogsRefreshFlag;
    },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchAllBlogs.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchAllBlogs.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.allBlogs = action.payload;
        })
        .addCase(fetchAllBlogs.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        })
        .addCase(createNewBlog.fulfilled, (state, action) => {
          state.allBlogs.unshift(action.payload);
        })
        .addCase(createNewBlog.rejected, (state, action) => {
          state.error = action.payload;
        });
    }
  });


const fetchAllBlogs = createAsyncThunk(
  'blogs/fetchAll',  // Action type prefix
  async ( _ , thunkAPI) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getallblogs`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to fetch blogs');
      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const createNewBlog = createAsyncThunk(
  'blogs/create',
  async (blogData, thunkAPI) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/createblog`, {
        method: 'POST',
        body: JSON.stringify(blogData),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to create blog');
      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export { fetchAllBlogs, createNewBlog };
export const { setBlogsRefresh } = blogsSlice.actions;
export default blogsSlice.reducer;











// 'blogs/fetchAll': This is the action type prefix. 
// Redux Toolkit will automatically generate three action types based on this prefix:
// blogs/fetchAll/pending: Dispatched when the thunk starts.
// blogs/fetchAll/fulfilled: Dispatched when the thunk succeeds.
// blogs/fetchAll/rejected: Dispatched when the thunk fails.


// The "_" is a convention used to represent a parameter that is not being used in the function, in this case, the first parameter is not being used.
