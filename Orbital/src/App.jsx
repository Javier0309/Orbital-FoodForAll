import { Routes, Route } from 'react-router-dom';
import Loginsignup from './Component/Loginsignup'
import CustMain from './Component/customerStuff/CustMain';
import BusMain from './Component/businessStuff/BusMain';
import Menu from './Component/businessStuff/Menu';
import CustFoodDesc from './Component/customerStuff/CustFoodDesc'
import { ToastContainer } from 'react-toastify';
import { useState, createContext } from 'react';
import OTPInput from './Component/OTPInput';
import Reset from './Component/Reset';
import Recovered from './Component/Recovered';
import Cart from './Component/customerStuff/Cart';
import Orders from './Component/businessStuff/Orders';
import EditProfile from './Component/businessStuff/EditProfile';
import AwaitingVerification from './Component/AwaitingVerification';
import DriverMain from './Component/driverStuff/DriverMain';
import DriverProfile from './Component/driverStuff/DriverProfile';
import TrackDelivery from './Component/customerStuff/TrackDelivery';
import OrderHistory from './Component/businessStuff/OrderHistory';
import CustomerRestaurantView from './Component/customerStuff/CustomerRestaurantView';
import BusAbout from './Component/businessStuff/BusAbout';
import CustAbout from './Component/customerStuff/CustAbout';
import DriverAbout from './Component/driverStuff/DriverAbout';
import ReviewRestaurant from './Component/customerStuff/ReviewRestaurant';
import BusReviews from './Component/businessStuff/BusReviews';
import MessageDriver from './Component/customerStuff/MessageDriver';
import MessageCustomer from './Component/driverStuff/MessageCustomer';
import DriverOrderHistory from './Component/driverStuff/OrderHistory';
import CustomerOrderHistory from './Component/customerStuff/OrderHistory';
import ViewCustProfile from './Component/customerStuff/ViewProfile';
import RestaurantPickupMap from './Component/customerStuff/RestaurantPickupMap';
import ViewProfile from './Component/businessStuff/ViewProfile';

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
          <Route path='/business-order-history' element={<OrderHistory />} />
          <Route path='/customer-order-history' element={<CustomerOrderHistory />} />
          <Route path='/customer-profile' element={<ViewCustProfile />} />
          <Route path="/restaurant/:businessId" element={<CustomerRestaurantView />} />
          <Route path="/restaurant/:businessId/map" element={<RestaurantPickupMap address={""} restaurantName={""} />} />
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