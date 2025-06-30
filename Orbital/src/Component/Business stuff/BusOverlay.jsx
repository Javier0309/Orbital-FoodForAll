
import './BusMain.css';
import AddFood from './AddFood';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const BusOverlay = () => {
    const navigate = useNavigate();
    const [busData, setBusData] = useState(null)
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        const fetchBusData = async ()=>{
            try{
                const email = localStorage.getItem('email');
                if (!email) {
                    console.error('No email found')
                    setLoading(false)
                    return
                }

                const response = await axios.get(`http://localhost:4000/api/business/business-by-email/${email}`);
                if (response.data.success) {
                    setBusData(response.data.business)
                } else {
                    console.error('Failed to fetch business data')
                }
            } catch (error){
                console.error('Error fetching business data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchBusData()
    }, [])

    return (
        <div className="bus-overlay">
            
            <div className="bus-content">
                <h1 className="title">{loading ? 'Loading...' : (busData?.name)}</h1>
                <div className="donate-button">
                <button onClick={() => navigate('/busmenu')}>Add food to donate</button>
                </div>
            </div>

            <div className="overlay"/>
        </div>
    )
}

export default BusOverlay;