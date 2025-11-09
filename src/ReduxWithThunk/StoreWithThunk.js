import { applyMiddleware, createStore } from "redux";
import RootReducerWithThunk from "./RootReducerWithThunk";
import { thunk } from "redux-thunk";

const storeWithThunk = createStore(RootReducerWithThunk, applyMiddleware(thunk));

export default storeWithThunk;