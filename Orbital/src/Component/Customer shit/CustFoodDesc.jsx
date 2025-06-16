import './CustMain.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from './StoreContext';
import { useContext } from 'react';
import FoodCard from './FoodCard';
import CustHeader from './CustHeader';

function CustFoodDesc(){

    const navigate = useNavigate();
    const {url} = useContext(StoreContext);
    const { state } = useLocation();

    if (!state) {
        return <p>Error: No food data found</p>
    }
    const {name, desc, image} = state;

    return(
        <>
            <CustHeader/>
            <div>
                <img className='card-image' src={url+"/images/"+image} alt=""/>
                <div>
                    <h2 className='card-title'>{name}</h2>
                    <p className='card-text'>{desc}</p>
                    <h2>Momo's Buffet Diner</h2>
                    <button>View Restaurant</button>
                </div>
            </div>

        </>
    )
}


export default CustFoodDesc;

