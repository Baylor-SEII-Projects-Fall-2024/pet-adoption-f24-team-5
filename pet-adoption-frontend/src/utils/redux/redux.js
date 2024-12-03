import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './userSlice';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user'],
};

const reducers = combineReducers({
    user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const buildStore = (initialState) => {
    return configureStore({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
                }
            }),
        preloadedState: initialState,
        devTools: process.env.NODE_ENV !== 'production',
    });
};

const store = buildStore({});
export const persistor = persistStore(store);
export default store;