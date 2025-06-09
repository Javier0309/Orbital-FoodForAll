import React from 'react';
import './BusMain.css';
import buffet from '../assets/buffet.jpg';

const BusOverlay = () => {
    return (
        <div className="bus-overlay">
            
            <div className="bus-content">
                <h1 className="title">Restaurant Name</h1>
                <div className="donate-button">
                <button>Add food to donate</button>
                </div>
            </div>

            <div className="overlay"/>
        </div>
    )
}

export default BusOverlay;