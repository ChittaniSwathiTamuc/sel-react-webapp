import { createStore } from "redux"; 
import RootReducer from '../Redux/RootReducer'

const store = createStore(RootReducer);

export default store;