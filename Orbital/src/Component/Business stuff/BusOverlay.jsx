import './BusMain.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const BusOverlay = () => {
    const navigate = useNavigate();
    const [busData, setBusData] = useState(null)
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        const fetchBusData = async ()=>{
            const email = localStorage.getItem('email');
            if (!email) {
                setLoading(false)
                return; // Do not fetch if no business email
            }

            try {
                const response = await axios.get(`http://localhost:4000/api/business/business-by-email/${email}`);
                if (response.data.success && response.data.business) {
                    setBusData(response.data.business);
                } else {
                    // Only log if email is present but fetch fails
                    console.error('Failed to fetch business data');
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
        <div
            className="bus-overlay"
            style={busData && busData.backgroundImageUrl ? {
                backgroundImage: `url(${busData.backgroundImageUrl.startsWith('http') ? busData.backgroundImageUrl : 'http://localhost:4000' + busData.backgroundImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            } : {}}
        >
            <div className="bus-content">
                <h1 className="title">
                    {loading
                        ? "Loading..."
                        : busData?.name
                            ? busData.name
                            : "Business Name"}
                </h1>
                <div className="donate-button">
                    <button onClick={() => navigate('/busmenu')}>Add food to donate</button>
                </div>
            </div>
            <div className="overlay"/>
        </div>
    )
}

export default BusOverlay;