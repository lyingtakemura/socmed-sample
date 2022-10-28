import { createSlice } from "@reduxjs/toolkit";

export const usersSlice = createSlice({
    name: "users",
    initialState: {
        currentUser: null,
    },
    reducers: {
        login: (state, action) => {
            state.currentUser = action.payload;
            console.log("LOGIN");
        },
        logout: (state) => {
            state.currentUser = null;
            console.log("LOGOUT");
        },
        update: (state, action) => {
            console.log(action);
            state.currentUser.image = action.payload;
            console.log("UPDATE");
        },
    },
});

export const { login, logout, update } = usersSlice.actions;

export default usersSlice.reducer;
