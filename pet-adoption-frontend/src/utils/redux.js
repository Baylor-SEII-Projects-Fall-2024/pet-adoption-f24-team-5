import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import userReducer from './userSlice';

const reducers = combineReducers({
    user: userReducer,
    // Add other reducers here
});

export const setToken = (token) => ({
    type: 'SET_TOKEN',
    payload: token,
});

export const buildStore = (initialState) => {
    return configureStore({
        preloadedState: initialState,
        reducer: reducers,
        middleware: (getDefaultMiddleware) => {
            return getDefaultMiddleware().concat(thunk);
        },
        devTools: process.env.NODE_ENV !== 'production',
    });
};