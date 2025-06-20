import { createContext, useState, useEffect } from "react"
import axios from "axios";

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState(0);
    const addToCart = (itemId) => {
        if (!cartItems[itemId]){
            setCartItems((prev)=>({...prev,[itemId]:1}))
        } else {
            setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        }
    }
    const removeFromCart = (itemId) => {
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
    }


    const url = "http://localhost:4000";
    const [food_list,setFoodList] = useState([])
    const contextValue = {
        food_list, setFoodList, url, cartItems, setCartItems, addToCart, removeFromCart
    };
    const fetchFoodList = async () => {
        const response = await axios.get(url+"/api/food/list");
        setFoodList(response.data.data)
    }

    useEffect(()=>{
        async function loadData() {
            await fetchFoodList()
        }
        loadData();
    }, [])

    useEffect(()=>{
        console.log(cartItems);
    }, [cartItems])

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider
