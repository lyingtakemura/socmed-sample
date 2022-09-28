import { createSlice } from '@reduxjs/toolkit'

export const usersSlice = createSlice({
    name: 'users',
    initialState: {
        currentUser: null
    },
    reducers: {
        login: (state, action) => {
            console.log(action.payload)
            state.currentUser = action.payload
            console.log('LOGIN')
        },
        logout: (state) => {
            state.currentUser = null
            console.log('LOGOUT')

        },
    },
})

export const { login, logout } = usersSlice.actions

export default usersSlice.reducer