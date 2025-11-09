import axios from "axios";

export const fetchAllUsersRequest = () =>({
    type: 'FETCH_ALL_USERS_REQUEST'
})

export const fetchAllUsersSuccess = (data) => ({
    type: 'FETCH_ALL_USERS_SUCCESS',
    payload: data
})

export const fetchAllUsersFailure = (error) => ({
    type: 'FETCH_ALL_USER_FAILURE',
    payload: error
})

export const fetchUserRequest = () => ({
    type: "FETCH_USER_REQUEST"
});

export const fetchUserSuccess = (data) => ({
    type: "FETCH_USER_SUCCESS",
    payload: data 
})

export const fetchUserFailure = (error) => ({
    type: "FETCH_USER_FAILURE",
    payload: error
})

export const fetchAllUsersWithThunk = () => {
    return async (dispatch) => {
        dispatch(fetchAllUsersRequest());
        await axios.get('https://jsonplaceholder.typicode.com/users')
       .then(async (response)=> {
            await dispatch(fetchAllUsersSuccess(response.data));
       })
       .catch((error)=>{
            dispatch(fetchAllUsersFailure(error.message))
       })
    }
}

export const fetchUserDataWithThunk = (userId) => {
    return async (dispatch)=>{
        // try{
        //     const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
        //     if(response.ok){
        //         const data = await response.json();
        //         await dispatch(fetchUserSuccess(data))
        //     }
        //     else{
        //         throw new Error(`Http error status: ${response.status}`)
        //     }
        // }
        // catch(error){
        //     console.log("swa999", error.message)
        //     await dispatch(fetchUserFailure(error.message));
        // }

        await dispatch(fetchUserRequest);
        fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
        .then(async (response) =>{
            if(response.ok){
                const data = await response.json();
                await dispatch(fetchUserSuccess(data))
            }
            else{
                throw new Error(`unable to retrieve data for the id: ${userId}`)
            }
        })
        .catch(async (error)=>{
           await dispatch(fetchUserFailure(error.message))
        })
        
    }
}


   

