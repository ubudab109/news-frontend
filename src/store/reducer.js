import { combineReducers } from '@reduxjs/toolkit';
import { AUTHORS, CATEGORIES, LOGIN, LOGOUT, REGISTER, SOURCES, USER_DATA } from './action';

const initialState = {
    userData: {},
    sources: [],
    authors: [],
    categories: [],
};

/**
 * exports a login process with a payload of data.
 * @param {Any} data
 */
export const loginProcess = data => ({
    type: LOGIN,
    payload: data,
});

export const registerProcess = data => ({
    type: REGISTER,
    payload: data,
});

export const logoutProcess = () => ({
    type: LOGOUT,
});

export const updateUserData = data => ({
    type: USER_DATA,
    payload: data,
});

export const sources = data => ({
    type: SOURCES,
    payload: data,
});

export const authors = data => ({
    type: AUTHORS,
    payload: data,
});

export const categories = data => ({
    type: CATEGORIES,
    payload: data,
});

const reducers = (state = initialState, action) => {
    switch(action.type) {
        case LOGIN:
            return {
                ...state,
                userData: action.payload,
            }
        case REGISTER:
            return {
                ...state,
                userData: action.payload,
            }
        case USER_DATA:
            return {
                ...state,
                userData: action.payload,
            }
        case SOURCES:
            return {
                ...state,
                sources: action.payload,
            }
        case AUTHORS:
            return {
                ...state,
                authors: action.payload,
            }
        case CATEGORIES: 
            return {
                ...state,
                categories: action.payload,
            }
        case LOGOUT:
            return state
        default:
            return state;
    };
};

const rootReducer = combineReducers({
    app: reducers,
});

export default rootReducer;
