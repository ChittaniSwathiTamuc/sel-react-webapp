export const fetchAllPostsRequest = ()=> ({
    type: "FETCH_ALL_POSTS_REQUEST"
})

export const fetchAllPostsSuccess = (data) => ({
    type: "FETCH_ALL_POSTS_SUCCESS",
    payload: data
}) 

export const fetchAllPostsFailure = (error) => ({
    type: "FETCH_ALL_POSTS_FAILURE",
    payload: error
})

export const fetchAllPostsWithThunk = () => {
    return async(dispatch) => {
        dispatch(fetchAllPostsRequest());
        try{
            const response = await fetch('https://jsonplaceholder.typicode.com/posts')
            if (response.ok){
                const data = await response.json();
                dispatch(fetchAllPostsSuccess(data))
            }
            else{
                throw new Error('unable to fetch the logos')
            }
            
        }
        catch(error){   
            dispatch(fetchAllPostsFailure(error.message))
        }
        
    }
}