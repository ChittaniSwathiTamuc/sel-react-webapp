import { combineReducers } from "redux";
import UserReducer from "../Redux/UserReducer";
import SymbolReducer from "../Redux/SymbolsReducer";

const RootReducer = combineReducers({
    user: UserReducer,
    symbols: SymbolReducer
})

export default RootReducer;