import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    userProfileInfo: JSON.parse(localStorage.getItem("userProfileInfo")) || null
}

const userSlice = createSlice(
    {
        name: 'user',
        initialState,
        reducers: {
        },
    
    }
);

export const updateProfile = createAsyncThunk(
    'user/update', 
    async(userProfileData, thunkAPI)=> {
        try{
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}`,{
                method: 'POST',
                body: JSON.stringify(userProfileData),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    
                },
                credentials: 'include',
            });

            if(!response.ok ) throw new Error(response.status);


        }catch(error){
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getProfile = createAsyncThunk(
    'user/get',
    async(userId, thunkAPI) => {
        try{
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}`, {
                method: 'POST',
                body: JSON.stringify({_id: userId}),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorizatoin': `Bearer ${localStorage.getItem('token')}`
                },
                credentials: "include",
            });

            if(!response.ok) throw new Error(response.status);
            console.log(response);
            return response;
        }catch(error){
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export default userSlice.reducer;