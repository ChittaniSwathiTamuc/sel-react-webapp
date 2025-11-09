export const fetchUserRequest = () => ({
    type : "FETCH_USER_REQUEST"
});

export const fetchUserSuccess = (data) =>({
    type : "FETCH_USER_SUCCESS",
    payload : data
});

export const fetchUserFailure = (error) => ({
    type: "FETCH_USER_FAILURE",
    payload : error
});

export const fetchSymbolsRequest = () => ({
    type: "FETCH_SYMBOLS_REQUEST"
});

export const fetchSymbolsSuccess = (data) => ({
    type: 'FETCH_SYMBOLS_SUCCESS',
    payload: data
});

export const fetchSymbolsFailure = (error) => ({
    type: 'FETCH_SYMBOLS_FAILURE',
    payload: error
});