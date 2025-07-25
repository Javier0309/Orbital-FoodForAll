import './DriverMain.css'
import { useState, useEffect } from 'react';
import axios from 'axios';
import DriverHeader from "./DriverHeader.jsx";
import AvailableOrders from './AvailableOrders.jsx';
import AssignedOrders from './AssignedOrders.jsx';
import DriverTracking from './DriverTracking.jsx';

const driverId = localStorage.getItem('driverId')

function DriverMain() {
    const [currentOrderId, setCurrentOrderId] = useState(null)
    const [isAvailable, setIsAvailable] = useState(true);
    const driverId = localStorage.getItem('driverId');

    useEffect(() => {
        if (!driverId) return;
        axios.get(`http://localhost:4000/api/drivers/${driverId}`)
            .then(res => setIsAvailable(res.data.driver.isAvailable))
            .catch(() => setIsAvailable(true));
    }, [driverId]);

    return (
        <>
            <div className="app">
                <DriverHeader/>
                <div className="main-content">
                    {/* Only show tracking/map if driver is NOT available */}
                    {!isAvailable && currentOrderId ? (
                        <div className="orders-section" style={{paddingBottom: 0, marginBottom: 0, borderBottom: 'none'}}>
                            <DriverTracking orderId={currentOrderId}/>
                            <AssignedOrders driverId={driverId} onOrderSelect={setCurrentOrderId}/>
                        </div>
                    ) : (
                        <div className="orders-section">
                            <AssignedOrders driverId={driverId} onOrderSelect={setCurrentOrderId}/>
                        </div>
                    )}
                    <hr style={{border: 'none', borderTop: '2px solid #e0e6d5', margin: '24px 0 16px 0'}} />
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
