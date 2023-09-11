import { createSlice } from "@reduxjs/toolkit";

export const authenticatedSlice = createSlice({
    name: "authenticated",
    initialState: {
        user: null,
    },
    reducers: {
        loginAction: (state, action) => {
            state.user = action.payload;
            console.log("LOGIN");
        },
        logoutAction: (state) => {
            state.user = null;
            console.log("LOGOUT");
        },
        updateAction: (state, action) => {
            console.log(action);
            state.user.image = action.payload;
            console.log("UPDATE");
        },
    },
});

export const { loginAction, logoutAction, updateAction } = authenticatedSlice.actions;
export default authenticatedSlice.reducer;
