import './CustMain.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from './StoreContext';
import { useContext } from 'react';
import CustHeader from './CustHeader';
import Plus from '../../assets/plus.png';
import Minus from '../../assets/minus.png';

function CustFoodDesc() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { url, cartItems, addToCart, removeFromCart } = useContext(StoreContext);

  if (!state) {
    return <p>Error: No food data found</p>;
  }

  // Make sure these are included when navigating to this page!
  const { id, name, desc, image, businessId, restaurantName } = state;

  return (
    <>
      <CustHeader />
      <div>
        <img className='card-image' src={url + "/images/" + image} alt={name} />
        <div>
          <h2 className='card-title'>{name}</h2>
          <p className='card-text'>{desc}</p>
          <div className='food-qty'>
            <img onClick={() => removeFromCart(id)} src={Minus} alt="minus" />
            <div>{cartItems[id]}</div>
            <img onClick={() => addToCart(id)} src={Plus} alt="plus" />
          </div>
          <h2>
            <span
              style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
              onClick={() => navigate('/view-profile', { state: { businessId } })}
            >
              {restaurantName}
            </span>
          </h2>
          <button onClick={() => navigate('/view-profile', { state: { businessId } })}>
            View Restaurant
          </button>
        </div>
      </div>
    </>
  );
}

export default CustFoodDesc;

