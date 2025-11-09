import React, {useEffect, useState} from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchUserRequest, fetchUserFailure, fetchUserSuccess } from "./Redux/Action";
import axios from "axios";

const Home = () => {
    const [userId, setUserId] = useState(0);
    //this user contains three parameters - loading, error and user in the initial state
    const userDetails = useSelector((state)=> state.user);
    const dispatch = useDispatch();

    const fetchUsersData = async() => {
        //we can use all of these methods to get the data 
        // dispatch(fetchUserRequest());
        // await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
        // .then(async (response) => {
        //     if(response.ok){
        //         let data = await response.json();
        //         console.log("swadata",data);
        //         dispatch(fetchUserSuccess(data))     
        //     }
        //      else {
        //          throw new Error(`unable to retrieve the data for the user : ${userId}`)
        //      }
        // })
        // .catch((error)=> dispatch(fetchUserFailure(error)))
        try{
            const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
            if (response.ok){
                let data = await response.json();
                console.log("swadata", data)
                await dispatch(fetchUserSuccess(data))
            }
            else{
                throw new Error(`Http error status: ${response.status}`)
            }
        }
        catch (error){
            await dispatch(fetchUserFailure(error.message))
        }
        // dispatch(fetchUserRequest());
        // await axios.get(`https://jsonplaceholder.typicode.com/users/${userId}`)
        // .then((response) => {
        //     dispatch(fetchUserSuccess(response.data))
        // })
        // .catch((error)=> {
        //     dispatch(fetchUserFailure(error.message))
        // })
            
    }
    return(
        <div>
            <h1>I am react Home component</h1>
            <input type="number" 
                value = {userId}
                onChange = {(e)=>setUserId(e.target.value)}
            />
            {userDetails.error !== '' ? <div>{userDetails.error}</div> : 
                <div><h4>UserName is: {userDetails.user.username}</h4></div>
            }
            
            <button onClick = {fetchUsersData}>
                Get UserName
            </button>
        </div>
        

    )
}

export default Home;