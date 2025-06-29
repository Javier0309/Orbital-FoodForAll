import './DriverMain.css'
import { useState } from 'react';
import DriverHeader from "./DriverHeader.jsx";
import AvailableOrders from './AvailableOrders.jsx';
import AssignedOrders from './AssignedOrders.jsx';
import DriverTracking from './DriverTracking.jsx';

const driverId = localStorage.getItem('driverId')

function DriverMain() {
    const [currentOrderId, setCurrentOrderId] = useState(null)
    return(
        <>
        <div className="app"> 
            <DriverHeader/>
            {currentOrderId && <DriverTracking orderId={currentOrderId}/>}
            <AssignedOrders driverId={driverId} onOrderSelect={setCurrentOrderId}/>
            <AvailableOrders driverId={driverId}/>

            <br/>
        </div>
    
        </>
    );
}

export default DriverMain;
