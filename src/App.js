import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Symbols from './Symbols';
import SymbolsWithBearerAuth from './SymbolsWithBearerAuth';
import store from './Redux/store';
import { Provider } from "react-redux";
import SymbolsChart from './SymbolsChart';

const App = () => {
  return(
    <Provider store={store}>
      <Router>
        <Routes>
            <Route path= '/' element = {<Symbols />} />  
        </Routes>
      </Router>
    </Provider>
  )
}

export default App;
