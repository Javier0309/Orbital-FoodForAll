import './DriverMain.css'
import { useState } from 'react';
import DriverHeader from "./DriverHeader.jsx";
import AvailableOrders from './AvailableOrders.jsx';
import AssignedOrders from './AssignedOrders.jsx';
import DriverTracking from './DriverTracking.jsx';

const driverId = localStorage.getItem('driverId')

function DriverMain() {
    const [currentOrderId, setCurrentOrderId] = useState(null)
    return (
        <>
            <div className="app">
                <DriverHeader/>
                <div className="main-content">
                    {currentOrderId && (
                        <div className="orders-section">
                            <DriverTracking orderId={currentOrderId}/>
                        </div>
                    )}
                    <div className="orders-section">
                        <h2 className="section-header">Assigned Orders</h2>
                        <AssignedOrders driverId={driverId} onOrderSelect={setCurrentOrderId}/>
                    </div>
                    <div className="orders-section">
                        <h2 className="section-header">Available Orders</h2>
                        <AvailableOrders driverId={driverId}/>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DriverMain;
