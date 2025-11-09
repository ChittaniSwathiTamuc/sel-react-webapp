import { act } from "react"

const userInitialState = {
    isLoading : false,
    user: {},
    error: ""
}

const allUsersInitialState = {
    isLoading: false,
    users: [],
    error: ""
}

export const userReducerWithThunk = (state= userInitialState, action)=>{
    switch(action.type){
        case 'FETCH_USER_REQUEST':
            return{...state, isLoading: true, user:{}, error: ""}
        
        case 'FETCH_USER_SUCCUESS':
            return {...state, isLoadinga: false, user:action.payload, error:""}
        
        case 'FETCH_USER_FAILURE':
            return {...state, isLoading: false, user:{}, error: action.payload}
        default: 
            return state;
    }
}

export const allUsersReducerWithThunk = (state=allUsersInitialState, action)=>{
    switch (action.type){
        case 'FETCH_ALL_USERS_REQUEST' :
            return {...state, isLoading: false, users:[], error: ""}
        case 'FETCH_ALL_USERS_SUCCESS':
            return {...state, isLoading: true, users:action.payload, error:""}
        case 'FETCH_ALL_USERS_FAILURE':
            return {...state, isLoading:false, users:[], error:action.payload}
        default:
            return state;
    }
}


// const userInitialState = {
//     loading: false,
//     user: {},
//     error: ""
// }

// const allUsersInitialState = {
//     loading: false,
//     users: [],
//     error: ''
// }

// export const userReducerWithThunk = (state= userInitialState, action) => {
//     switch(action.type) {
//         case 'FETCH_USER_REQUEST':
//             return {...state, loading:true}
//         case 'FETCH_USER_SUCCESS':
//             return {...state, loading:false, error:"", user:action.payload}
//         case 'FETCH_USER_FAILURE':
//             return {...state, loading:false, user:{}, error: action.payload }
//         default :
//             return state;
//     }
// }

// export const allUsersReducerWithThunk = (state = allUsersInitialState, action) => {
//     switch (action.type) {
//         case 'FETCH_ALL_USERS_REQUEST' :
//             return {...state, loading: true, users:[], error: ''}
//         case 'FETCH_ALL_USERS_SUCCESS' :
//             return {...state, loading: false, users: action.payload, error:''}
//         case 'FETCH_ALL_USERS_FAILURE' :
//             return {...state, loading:false, users:[], error: action.payload}
//         default:
//             return state;
//     }
// }



// export default userReducerWithThunk;