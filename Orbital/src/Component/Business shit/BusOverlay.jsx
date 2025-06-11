
import './BusMain.css';
import { useNavigate } from 'react-router-dom';

const BusOverlay = () => {
    const navigate = useNavigate();
    const handleClick = () => navigate('/busmenu');
    return (
        <div className="bus-overlay">
            
            <div className="bus-content">
                <h1 className="title">Restaurant Name</h1>
                <div className="donate-button">
                <button onClick={handleClick}>Add food to donate</button>
                </div>
            </div>

            <div className="overlay"/>
        </div>
    )
}

export default BusOverlay;