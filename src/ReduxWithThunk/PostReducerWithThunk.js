const initialstate = {
    loading : false,
    posts: [],
    error: ''
}

export const AllPostsReducerWithThunk = (state= initialstate, action) => {
    switch(action.type){
        case 'FETCH_ALL_POSTS_REQUEST':
            return {...state, loading:true, posts:[], error:''} 
        case 'FETCH_ALL_POSTS_SUCCESS':
            return {...state, loading:false, posts:action.payload, error:''}
        case 'FETCH_ALL_POSTS_FAILURE':
            return {...state, loading:false, posts:[], error: action.payload}
        default:
            return state;
    }
}