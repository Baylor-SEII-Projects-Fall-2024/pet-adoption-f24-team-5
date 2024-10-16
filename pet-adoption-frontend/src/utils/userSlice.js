import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentId: null,
    email: '',
    userType: '',
    age: null,
    phoneNumber: '',
    token: null, // Add token to the state
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            return { ...state, ...action.payload };
        },
        clearUser(state) {
            return initialState;
        },
        setToken(state, action) { // Add action to set token
            state.token = action.payload;
        },
        clearToken(state) { // Add action to clear token
            state.token = null;
        },
    },
});

export const { setUser, clearUser, setToken, clearToken } = userSlice.actions;
export default userSlice.reducer;