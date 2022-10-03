import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import usersReducer from "./usersSlice";

const reducers = combineReducers({
    users: usersReducer,
});

const persistConfig = {
    key: "root",
    version: 1,
    storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
});
