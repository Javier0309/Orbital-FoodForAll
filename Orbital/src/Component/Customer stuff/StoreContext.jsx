import { createContext, useState, useEffect } from "react"
import axios from "axios";
import { supabase } from "../../../backend/SupabaseClient";

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const addToCart = async (itemId) => {
        try {
                const session = await supabase.auth.getSession();
                const token = session.data.session.access_token;

                const res = await axios.post(url + "/api/cart/add", {itemId}, {headers: {Authorization: `Bearer ${token}`}});

            if (res.data.success) {
                setCartItems (prev => ({...prev, [itemId]: (prev[itemId] || 0) + 1}))
            }
        } catch (error) {
            console.error("Error adding to cart:", error)
        }
    }


    const removeFromCart = async (itemId) => {
        try {
                const session = await supabase.auth.getSession();
                const token = session.data.session.access_token;

                const res = await axios.post(url + "/api/cart/remove", {itemId}, {headers: {Authorization: `Bearer ${token}`}});

            if (res.data.success) {
                setCartItems (prev => {
                    const updated = {...prev}; 
                    if (updated[itemId] > 1) {
                        updated[itemId] -= 1;
                    } else {
                        delete updated[itemId];
                    }
                    return updated;
                });
            }
        } catch (error) {
            console.error("Error removing from cart:", error)
        }
    }
    
    const placeOrder = async () => {
        try {
            const session = await supabase.auth.getSession();
            const token = session.data.session?.access_token;
            if (!token) {
                alert("User not logged in");
                return;
            } 

            const res = await axios.post(
                url + "/api/order/place",
                {},
                {headers: {Authorization: `Bearer ${token}`}}
            )

            if (res.data.success){
                alert("Order placed successfully")
                setCartItems({});
            } else {
                alert ("Failed to place order")
            }
        } catch (error) {
            console.error("Error placing order:", error)
            alert("An error occured while placing the order")
        }
    }

    useEffect(()=>{
        console.log(cartItems);
    }, [cartItems])


    const url = "http://localhost:4000";
    const [food_list,setFoodList] = useState([])

    const fetchFoodList = async (businessId = null) => {
        try {
            const endpoint = businessId 
            ? `${url}/api/food/list/${businessId}`
            : `${url}/api/food/list`;
            const response = await axios.get(endpoint);
            setFoodList(response.data.data)
        } catch (error) {
            console.error("Failed to fetch food list", error)
        }
    } 

    const fetchCartFromBackend = async () => {
        try {
            const session = await supabase.auth.getSession();
            const token = session.data.session?.access_token;
            console.log("Supabase access token:", token);
            const res = await axios.get(url + "/api/cart", {headers: {Authorization: `Bearer ${token}`}});

            if (res.data.success) {
                setCartItems (res.data.cartData);
            }
        } catch (error) {
            console.error("Failed to fetch cart:", error)
        }
    }

    useEffect(()=>{
        async function loadData() {
            await fetchFoodList();
            await fetchCartFromBackend();
        }
        loadData();
    }, [])

    const contextValue = {
        food_list, setFoodList, url, cartItems, setCartItems, addToCart, removeFromCart, fetchFoodList, placeOrder
    };
    
    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider
