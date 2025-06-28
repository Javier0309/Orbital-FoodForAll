import './DriverMain.css'

import DriverHeader from "./DriverHeader.jsx";
import AvailableOrders from './AvailableOrders.jsx';
import AssignedOrders from './AssignedOrders.jsx';
import DriverTracking from './DriverTracking.jsx';

const driverId = localStorage.getItem('driverId')

function DriverMain() {
    return(
        <>
        <div className="app"> 
            <DriverHeader/>
            <DriverTracking driverId={driverId}/>
            <AssignedOrders driverId={driverId}/>
            <AvailableOrders driverId={driverId}/>

            <br/>
        </div>
    
        </>
    );
}

export default DriverMain;
