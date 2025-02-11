import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isToggled: false,
    draftRefresh: false,
    url: "http://localhost:8080", // Can also move this to .env if needed
      // const url = "https://blogwise-backend.onrender.com";
}

const toggleSlice = createSlice({
    name: 'toggle',
    initialState,
    reducers: {
        setIsToggled: (state) => {
            state.isToggled = !state.isToggled;
        },
        setDraftRefresh: (state) => {
            state.draftRefresh = !state.draftRefresh;
        }
    }
});

export const { setIsToggled, setDraftRefresh } = toggleSlice.actions;
export default toggleSlice.reducer;