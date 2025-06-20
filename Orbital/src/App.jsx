import { Routes, Route } from 'react-router-dom';
import Loginsignup from './Component/Loginsignup'
import SignupPage from './Component/SignupPage';
import CustMain from './Component/Customer shit/CustMain';
import BusMain from './Component/Business shit/BusMain';
import Menu from './Component/Business shit/Menu';
import CustFoodDesc from './Component/Customer shit/CustFoodDesc'
import { ToastContainer } from 'react-toastify';
import { useState, createContext } from 'react';
import OTPInput from './Component/OTPInput';
import Reset from './Component/Reset';
import Recovered from './Component/Recovered';
import Cart from './Component/Customer shit/Cart';
//import { Route, Routes } from 'react-router-dom'


export const RecoveryContext = createContext();

function App() {
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');

  return (
    <>
      <ToastContainer />
      <RecoveryContext.Provider value={{ otp, setOTP, setEmail, email }}>
        <Routes>
          <Route path="/" element={<Loginsignup />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/otp" element={<OTPInput />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/recovered" element={<Recovered />} />
          <Route path="/custmain" element={<CustMain />} />
          <Route path="/cust-food-desc" element={<CustFoodDesc />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/busmain" element={<BusMain />} />
          <Route path="/busmenu" element={<Menu />} />
        </Routes>
      </RecoveryContext.Provider>
    </>
  );
}

export default App;