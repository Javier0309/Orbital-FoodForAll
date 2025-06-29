import './CustMain.css';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from './StoreContext';
import { useContext } from 'react'

function FoodCard({id,name,desc,image, quantity, cookedAt, consumeBy, comment, businessId}){
    const navigate = useNavigate();
    const handleClick = () => navigate('/cust-food-desc', {
        state: {id, name, desc, image, quantity,  cookedAt, consumeBy, comment, businessId}
    });
    const {url} = useContext(StoreContext);

    return(
        <>
        <div className='foodcard'> 
            <div className='content'>
                <img className='card-image' src={url+"/uploads/"+image} alt=""></img>
                <h2 className='card-title'>{name}</h2>
                <p className='card-text'>{desc.length > 100 ? desc.slice(0,60) + '...' : desc}</p>
                {/*<button className='card-button'>Add to Cart</button>*/}
            </div>

            <div className="overlay" onClick={handleClick}/>
        </div>
        </>
    )
}

export default FoodCard;