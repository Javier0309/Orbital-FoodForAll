import './CustMain.css';
import beefRendang from '../../assets/Beef Rendang.png';
import { useNavigate } from 'react-router-dom';

function FoodCard(){
    const navigate = useNavigate();
    const handleClick = () => navigate('/cust-food-desc');

    return(
        <>
        <div className='foodcard'> 
            <div className='content'>
                <img className='card-image' src={beefRendang} alt="picture"></img>
                <h2 className='card-title'>Beef Rendang</h2>
                <p className='card-text'>beef (chucks or short ribs), coconut milk, and a rich spice paste</p>
                {/*<button className='card-button'>Add to Cart</button>*/}
            </div>

            <div className="overlay" onClick={handleClick}/>
        </div>
        </>
    )
}

export default FoodCard;