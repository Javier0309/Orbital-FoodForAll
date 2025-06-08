import './CustMain.css';
import beefRendang from '../assets/Beef Rendang.png';

function FoodCard(){
    return(
        <div className='foodcard'> 
            <img className='card-image' src={beefRendang} alt="picture"></img>
            <h2 className='card-title'>Beef Rendang</h2>
            <p className='card-text'>beef (chucks or short ribs), coconut milk, and a rich spice paste</p>
            <button className='card-button'>Add to Cart</button>
        </div>
    )
}

export default FoodCard;