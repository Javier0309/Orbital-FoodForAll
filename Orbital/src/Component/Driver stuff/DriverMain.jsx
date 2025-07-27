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
    const [refreshKey, setRefreshKey] = useState(0);
    const driverId = localStorage.getItem('driverId');

    useEffect(() => {
        if (!driverId) return;
        axios.get(`http://localhost:4000/api/drivers/${driverId}`)
            .then(res => setIsAvailable(res.data.driver.isAvailable))
            .catch(() => setIsAvailable(true));
    }, [driverId]);

    const handleOrderAccepted = () => {
        setRefreshKey(k => k + 1);
        setIsAvailable(false); 
    };

    const handleAssignedOrdersChange = (orders) => {
        if (orders && orders.length > 0) {
            setIsAvailable(false);
        }
    };

    return (
        <>
            <div className="app">
                <DriverHeader/>
                <div className="main-content">
                    {/* Only show tracking/map if driver is NOT available */}
                    {!isAvailable && currentOrderId ? (
                        <div className="orders-section" style={{paddingBottom: 0, marginBottom: 0, borderBottom: 'none'}}>
                            <DriverTracking orderId={currentOrderId} refreshKey={refreshKey}/>
                            <AssignedOrders driverId={driverId} onOrderSelect={setCurrentOrderId} refreshKey={refreshKey} setHasAssignedOrders={handleAssignedOrdersChange}/>
                        </div>
                    ) : (
                        <div className="orders-section">
                            <AssignedOrders driverId={driverId} onOrderSelect={setCurrentOrderId} refreshKey={refreshKey} setHasAssignedOrders={handleAssignedOrdersChange}/>
                        </div>
                    )}
                    <hr style={{border: 'none', borderTop: '2px solid #e0e6d5', margin: '24px 0 16px 0'}} />
                    <div className="orders-section">
                        <h2 className="section-header">Available Orders</h2>
                        <AvailableOrders driverId={driverId} onOrderAccepted={handleOrderAccepted}/>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DriverMain;
