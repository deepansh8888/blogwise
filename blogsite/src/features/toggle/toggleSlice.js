import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isToggled: false,
    draftRefresh: false,
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