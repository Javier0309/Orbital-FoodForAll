import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loginsignup from './Component/Loginsignup'
import SignupPage from './Component/SignupPage';
import CustMain from './Component/CustMain';
import BusMain from './Component/BusMain';


function App() {
  return (
    <Router>
      <Routes>
        {/* Route to main login/signup landing page */}
        <Route path="/" element={<Loginsignup />} />

        {/* Route to a separate sign-up page */}
        <Route path="/signup" element={<SignupPage />} />

        {/* Route to Customers' main menu page */}
        <Route path="/custmain" element={<CustMain />} />

        {/* Route to Business' main menu page */}
        <Route path="/busmain" element={<BusMain />} />
        
      </Routes>
    </Router>
  );
}
/*function App() {

  return(
  <div>
    <Loginsignup/>
  </div>
  );
}*/
export default App
