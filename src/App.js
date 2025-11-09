import React from "react";
import Tabs from './Tabs';
//import HomeWithThunk from "./ReduxWithThunk/HomeWithThunk";
import Home from "./Home";
import About from './About';
import Contact from './Contact';
//import StoreWithThunk from './ReduxWithThunk/StoreWithThunk';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import storeWithThunk from "./ReduxWithThunk/StoreWithThunk";
import Symbols from './Symbols';
import store from './Redux/store';
import { Provider } from "react-redux";

const App = () => {
  return(
    <Provider store={store}>
      <Router>
        <Tabs />
        <Routes>
            <Route path= '/home' element = {<Home />} />
            <Route path= '/aboutus' element = {<About />} />
            <Route path= '/contactus' element = {<Contact />} />
            <Route path= '/symbols' element = {< Symbols />} />  
        </Routes>
      </Router>
    </Provider>
  )
}

export default App;



// import './App.css';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// // import Home from './Home';
// import Tabs from './Tabs';
// import About from './About';
// import Contact from './Contact';
// // import store from './Redux/store';
// import { Provider } from 'react-redux';
// import HomeWithThunk from './ReduxWithThunk/HomeWithThunk';
// import storeWithThunk from './ReduxWithThunk/StoreWithThunk';


// function App() {
//   return(
//     <Provider store={storeWithThunk}>
//       <Router>
//           <Tabs />
//           <Routes>
//               <Route path="/" element={<HomeWithThunk />}/>
//               <Route path="/aboutus" element= {<About />}/>
//               <Route path="/contactus" element= {<Contact />}/>
//           </Routes>
//       </Router>

//     </Provider>
//   )
// }


// export default App;
