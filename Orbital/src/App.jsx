import { Routes, Route } from 'react-router-dom';
import Loginsignup from './Component/Loginsignup'
import SignupPage from './Component/SignupPage';
import CustMain from './Component/Customer stuff/CustMain';
import BusMain from './Component/Business stuff/BusMain';
import Menu from './Component/Business stuff/Menu';
import CustFoodDesc from './Component/Customer stuff/CustFoodDesc'
import { ToastContainer } from 'react-toastify';
import { useState, createContext } from 'react';
import OTPInput from './Component/OTPInput';
import Reset from './Component/Reset';
import Recovered from './Component/Recovered';
import Cart from './Component/Customer stuff/Cart';
import Orders from './Component/Business stuff/Orders';
import EditProfile from './Component/Business stuff/EditProfile';
import ViewProfile from './Component/Business stuff/ViewProfile';
import AwaitingVerification from './Component/AwaitingVerification';
import DriverMain from './Component/Driver stuff/DriverMain';
import DriverProfile from './Component/Driver stuff/DriverProfile';
import TrackDelivery from './Component/Customer stuff/TrackDelivery';
import OrderHistory from './Component/Business stuff/OrderHistory';
import CustomerRestaurantView from './Component/Customer stuff/CustomerRestaurantView';
import BusAbout from './Component/Business stuff/BusAbout';
import CustAbout from './Component/Customer stuff/CustAbout';
import DriverAbout from './Component/Driver stuff/DriverAbout';
import ReviewRestaurant from './Component/Customer stuff/ReviewRestaurant';
import BusReviews from './Component/Business stuff/BusReviews';
import MessageDriver from './Component/Customer stuff/MessageDriver';
import MessageCustomer from './Component/Driver stuff/MessageCustomer';
import DriverOrderHistory from './Component/Driver stuff/OrderHistory';
import CustomerOrderHistory from './Component/Customer stuff/OrderHistory';
import Favourites from './Component/Customer stuff/Favourites';

//import { Route, Routes } from 'react-router-dom'


export const RecoveryContext = createContext();

function App() {
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const userId = localStorage.getItem("userId");

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
          <Route path="/busorders" element={<Orders />} />
          <Route path="/edit-profile" element={<EditProfile userId={userId} />} />
          <Route path="/view-profile" element={<ViewProfile userId={userId} />} />
          <Route path='/awaiting-verification' element={<AwaitingVerification />} />
          <Route path='/drivermain' element={<DriverMain />} />
          <Route path='/driverprofile' element={<DriverProfile />} />
          <Route path='/track-delivery/:orderId' element={<TrackDelivery/>}/>
          <Route path='/order-history' element={<CustomerOrderHistory />} />
          <Route path='/favourites' element={<Favourites />} />
          <Route path="/restaurant/:businessId" element={<CustomerRestaurantView />} />
          <Route path="/about" element={<BusAbout />} />
          <Route path="/customer-about" element={<CustAbout />} />
          <Route path="/driver-about" element={<DriverAbout />} />
          <Route path="/restaurant/:businessId/review" element={<ReviewRestaurant />} />
          <Route path="/reviews" element={<BusReviews />} />
          <Route path="/message/:driverId" element={<MessageDriver />} />
          <Route path="/driver/message/:driverId" element={<MessageCustomer />} />
          <Route path='/driver-order-history' element={<DriverOrderHistory />} />


        </Routes>
      </RecoveryContext.Provider>
    </>
  );
}

export default App;