import React from "react";
import { Link } from "react-router-dom";

const Tabs = () => {
    return(
        <div>
            <Link to='/home'>Home</Link>
            <Link to='aboutus'>About Us</Link>
            <Link to='/contactus'>Contact Us</Link>
            <Link to='/symbols'>Symbols</Link>
        </div>
    )
}

export default Tabs;

// import React from "react";
// import { Link } from "react-router-dom";

// const Tabs = () => {
//     return(
//         <div>
//             <Link to ='/home'>Home</Link>
//             <Link to ='/aboutus'>About Us</Link>
//             <Link to ='/contactus'>Contact Us</Link>
//         </div>
        
//     )
// }

// export default Tabs;