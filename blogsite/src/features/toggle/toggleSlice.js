import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    refreshBlogsFlag: false,
    draftRefresh: false,
}

const toggleSlice = createSlice({
    name: 'toggle',
    initialState,
    reducers: {
        setRefreshBlogs: (state) => {
            state.refreshBlogsFlag = !state.refreshBlogsFlag;
        },
        setDraftRefresh: (state) => {
            state.draftRefresh = !state.draftRefresh;
        }
    }
});

export const { setRefreshBlogs, setDraftRefresh } = toggleSlice.actions;
export default toggleSlice.reducer;