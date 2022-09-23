import { createSlice } from '@reduxjs/toolkit'

export const usersSlice = createSlice({
    name: 'users',
    initialState: {
        user: {
            token: null
        }
    },
    reducers: {
        login: (state, action) => {
            console.log(action.payload)
            state.user.token = action.payload
        },
        logout: (state) => {
            state.user.token = null
            console.log('qqq')

        },
    },
})

export const { login, logout } = usersSlice.actions

export default usersSlice.reducer