import * as types from "./constants.js"

const initialState = {
    user: null,
};

export function user(state = null, action) {
    if (action.type == types.SET_USER) {
        //// console.log("reducer", action);
        return action.payload;
    }

    return state;
}