import {userReducerWithThunk, allUsersReducerWithThunk} from '../ReduxWithThunk/UserReducerWithThunk';
import {AllPostsReducerWithThunk} from '../ReduxWithThunk/PostReducerWithThunk';
import { combineReducers } from 'redux';


const RootReducerWithThunk = combineReducers({
    userWithThunk :userReducerWithThunk,
    allUsersWithThunk : allUsersReducerWithThunk,
    allPostsWithThunk : AllPostsReducerWithThunk
})

export default RootReducerWithThunk;