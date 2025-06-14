import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loginsignup from './Component/Loginsignup'
import SignupPage from './Component/SignupPage';
import CustMain from './Component/Customer shit/CustMain';
import BusMain from './Component/Business shit/BusMain';
import Menu from './Component/Business shit/Menu';
import CustFoodDesc from './Component/Customer shit/CustFoodDesc'
 import { ToastContainer } from 'react-toastify';
//import { Route, Routes } from 'react-router-dom'



function App() {
  return (
    <>
      <ToastContainer/>
      <Routes>
        {/* Route to main login/signup landing page */}
        <Route path="/" element={<Loginsignup />} />

        {/* Route to a separate sign-up page */}
        <Route path="/signup" element={<SignupPage />} />

        {/* Route to Customers' main menu page */}
        <Route path="/custmain" element={<CustMain />} />

        {/* Route to Customers' main menu page */}
        <Route path="/cust-food-desc" element={<CustFoodDesc />} />
        
        {/* Route to Customers' cart page }
        <Route path="/cart" element={<Cart />} /> */}

        {/* Route to Business' main menu page */}
        <Route path="/busmain" element={<BusMain />} />

        {/* Route to Business' Menu page */}
        <Route path="/busmenu" element={<Menu />} />
        
      </Routes>

    </>
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
