
const initialState = {
    isLoading : false,
    symbols: [],
    error : ''
}

const SymbolsReducer = (state = initialState, action) => {
    switch (action.type) {
        case "FETCH_SYMBOLS_Request": return {...state, isLoading: true}
        case "FETCH_SYMBOLS_SUCCESS": return {...state, symbols: action.payload}
        case "FETCH_SYMBOLS_FAILURE": return {...state, error: action.error}
        default: return state;
    }
};

export default SymbolsReducer;