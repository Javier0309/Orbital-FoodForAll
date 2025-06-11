import './CustMain.css';
import beefRendang from '../../assets/Beef Rendang.png';
import { useNavigate } from 'react-router-dom';
import CustHeader from "./CustHeader.jsx";
import React, { useState } from 'react';
//import { useParams } from 'react-router-dom';

function CustFoodDesc(){

    return(
        <>
            <CustHeader/>
            <div>
                <img src={beefRendang} alt=""/>
                <div>
                    <h2>Momo's Buffet Diner</h2>
                    <button>View Restaurant</button>
                </div>
            </div>

        </>
    )
}

export default CustFoodDesc;