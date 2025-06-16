import { useContext } from "react";
import './CustMain.css'
import FoodCard from "./FoodCard.jsx";
import { StoreContext } from "./StoreContext";

const FoodDisplay = ({category}) => {

    const {food_list} = useContext(StoreContext)

    return (
        <div id='food-display'>
        <h2>Food near you, for you</h2>
            <div className='food-display-list'>
                {food_list.map((item,index) => {
                    return <FoodCard key={index} id={item._id} name={item.name} desc={item.desc} quantity={item.quantity} image={item.image}/>
                })}
            </div>
        </div>

    )
}

export default FoodDisplay