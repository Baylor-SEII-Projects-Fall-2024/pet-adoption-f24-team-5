import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentId: null,
    email: '',
    userType: '',
    age: null,
    phoneNumber: '',
    token: null,
    displayName: '',
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
        setToken(state, action) {
            state.token = action.payload;
        },
        clearToken(state) {
            state.token = null;
        },
        setDisplayName(state, action) {
            state.displayName = action.payload;
        }
    },
});

export const { setUser, clearUser, setToken, clearToken, setDisplayName } = userSlice.actions;
export default userSlice.reducer;