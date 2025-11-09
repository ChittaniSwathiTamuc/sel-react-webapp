import React, { useState, useEffect } from "react";
import { fetchUserDataWithThunk, fetchAllUsersWithThunk } from "./UserActionsWithThunk";
import { useSelector , useDispatch} from "react-redux";
import { fetchAllPostsWithThunk } from "./PostActionsWithThunk";

const HomeWithThunk = () => {
    const [userId, setUserId] = useState(0);
    const userDetails = useSelector((state)=> state.userWithThunk);
    const allUserDetails = useSelector((state)=> state.allUsersWithThunk);
    const allPostsDetails = useSelector((state)=> state.allPostsWithThunk);
    const dispatch = useDispatch();

    const users = [
    {
        id: 1,
        name: "josh",
        isActive: true,
        age: 23
    },
    {
        id: 2,
        name: "kiran",
        isActive: false,
        age: 40
    },
    {
        id: 3,
        name: "kavitha",
        isActive: true,
        age:45
    }
]

    useEffect (()=>{
        dispatch(fetchAllUsersWithThunk())
        dispatch(fetchAllPostsWithThunk())

    },[dispatch])
    useEffect (()=>{

        javascriptPractice();
    },[])

    function javascriptPractice() {
        // for(let i=0; i<users.length; i++){
        //     console.log(users[i].name);
        // }
        //const names = users.find((user)=> user.isActive).map((user)=> user.name)
        // const names = users.filter((user)=> user.isActive).map((user)=> user.name)
        // console.log("swa", names);
        // users.forEach((user)=>{
        //     user.isActive &&
        //         console.log("iam " + user.name)
        // })

        // const names = users.sort((user1, user2)=> 
        //     user1.age < user2.age ? 1 : -1
        // ).filter((user)=> user.isActive).map((user)=> user.name);
        // console.log("swa",names)
        const names = users.sort((user1,user2)=> user1.age > user2.age ? 1 : -1).filter((user)=> user.isActive)
            .map((user)=> user.name);
        console.log("swa", names);
    }

    const buttonClicked = () => {
        dispatch(fetchUserDataWithThunk(userId));
    }

    return(
        <div>
            <h2>I am home component with thunk</h2>
            {allUserDetails.users?.length > 0 && 
                <div>
                    {allUserDetails.users.map((user, index)=>(
                        <div key={index}>{user.username}</div>
                    ))}
                </div>
            }
            {allPostsDetails.posts?.length > 0 &&
                <div>
                    {allPostsDetails.posts.map((post, index)=> (
                        <div key={index}>{post.title}</div>
                    ))}
                </div>
            }
            <input 
                type="number" 
                value={userId} 
                onChange={(e)=> setUserId(e.target.value)}
            />
        
            {userDetails.error !== '' ? <div>{userDetails.error}</div> :
               <div><h2>The userName is : {userDetails.user.username}</h2></div>
            }
            <button onClick = {()=>buttonClicked()}>Get User data using thunk</button>
        </div>
    )
}

export default HomeWithThunk;
