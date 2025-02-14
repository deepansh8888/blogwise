import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

let initialState = {
  allBlogs: [],
  userBlogs: [],
  singleBlog: null,
  blogsRefreshFlag: false,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
}

const blogsSlice = createSlice({
    name: 'blogs',
    initialState,
    reducers: {
      setBlogsRefresh: (state) => {
        state.blogsRefreshFlag = !state.blogsRefreshFlag;
      }
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
        .addCase(createNewBlog.fulfilled, (state, action) =>{
          state.status = 'idle';
        })
        .addCase(createNewBlog.rejected, (state, action) => {
          state.error = action.payload;
        })
        .addCase(fetchUserBlogs.fulfilled, (state, action)=>{
          state.userBlogs = action.payload;
        })
        .addCase(deleteblog.fulfilled, (state, action)=>{
          state.status = 'succeeded';
        })
        .addCase(fetchsingleblog.fulfilled, (state, action) => {
          state.singleBlog = action.payload;
        })
    }
  });


export const fetchAllBlogs = createAsyncThunk(
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

export const createNewBlog = createAsyncThunk(
  'blogs/create',
  async (blogData, thunkAPI) => {
    try {
      let blogToSend = {...blogData, username: localStorage.getItem("user")};
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/createblog`, {
        method: 'POST',
        body: JSON.stringify(blogToSend),
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

export const fetchUserBlogs = createAsyncThunk(
  'blogs/fetchuserblogs',
  async ( _, thunkAPI) => {
    try{
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getmyblogs`, {
        method: 'POST',
        body: JSON.stringify({ username: localStorage.getItem('user') }),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include',
      });
      return await response.json();
    }catch(error){
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteblog = createAsyncThunk(
  'blogs/delete',
  async (_id, thunkAPI) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/deleteblog`, {
        method: 'POST',
        body: JSON.stringify({ _id: _id }),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to delete blog');
      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


export const fetchsingleblog = createAsyncThunk('blogs/getsingleblog', 
  async( blogId, thunkAPI) => {
    try{
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getSingleBlog`, {
        method: 'POST',
        body: JSON.stringify({ blogId }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include',
      });

      if (!response.ok) throw new Error(`Failed to fetch blog: ${response.status}`);
      return await response.json();
    }catch(error){
      return thunkAPI.rejectWithValue(error.message);
    }
  }
)

export default blogsSlice.reducer;
export const { setBlogsRefresh } = blogsSlice.actions;





// 'blogs/fetchAll': This is the action type prefix. 
// Redux Toolkit will automatically generate three action types based on this prefix:
// blogs/fetchAll/pending: Dispatched when the thunk starts.
// blogs/fetchAll/fulfilled: Dispatched when the thunk succeeds.
// blogs/fetchAll/rejected: Dispatched when the thunk fails.


// The "_" is a convention used to represent a parameter that is not being used in the function, in this case, the first parameter is not being used.
