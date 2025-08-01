import { createContext, useState, useEffect } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../backend/SupabaseClient";

export const StoreContext = createContext(null)
const url = "http://localhost:4000";

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const addToCart = async (itemId, comment) => {
        try {
                const session = await supabase.auth.getSession();
                const token = session.data.session.access_token;

                const res = await axios.post(url + "/api/cart/add", {itemId, comment}, {headers: {Authorization: `Bearer ${token}`}});

            if (res.data.success) {
                setCartItems (prev => ({...prev, [itemId]: {quantity: (prev[itemId]?.quantity || 0) + 1, comment: comment || (prev[itemId]?.comment ?? "")}}))
            }
        } catch (error) {
            console.error("Error adding to cart:", error)
            if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert("Error adding item to cart");
            }
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
                    if (updated[itemId]?.quantity > 1) {
                        updated[itemId].quantity -= 1;
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

    const updateCartComment = async (id, newComment) => {
        try {
            const session = await supabase.auth.getSession();
            const token = session.data.session.access_token;

            const res = await axios.post(url + "/api/cart/update-comment", {itemId: id, comment: newComment}, {headers: {Authorization: `Bearer ${token}`}});

            if (res.data.success) {
                setCartItems(prev => {
                    const existingQuantity = prev[id]?.quantity || 0;

                    return {
                        ...prev,
                        [id]: {
                            quantity: existingQuantity,
                            comment: newComment !== undefined && newComment !== "" ? newComment : ""
                        }
                    };
                });
            }
        } catch (error) {
            console.error("Error updating cart comment:", error);
            if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert("Error updating comment");
            }
        }
    };    

    const navigate = useNavigate();
    const placeOrder = async (deliveryMode = 'pickup') => {
        try {
            const session = await supabase.auth.getSession();
            const token = session.data.session?.access_token;
            if (!token) {
                alert("User not logged in");
                return;
            } 

            // Get the customer email from the current session
            const customerEmail = session.data.session?.user?.email;

            const orderItems = Object.entries(cartItems).map(([foodId, { quantity, comment}]) => ({
                foodId, quantity, comment
            }))

            const data = {
                items: orderItems,
                deliveryMode,
                customerEmail // Pass the customer email explicitly
            }

            const sendOrder = async() => {
                const res = await axios.post(
                        url + "/api/order/place", data,
                        {headers: {Authorization: `Bearer ${token}`}}
                )

                if (res.data.success){
                    alert("Order placed successfully")
                    setCartItems({});
                    await fetchFoodList();

                    const orderId = res.data.order?._id || res.data.orders?.[0]?._id;
                    if (orderId) navigate(`/track-delivery/${orderId}`)     // orderId to be used by TrackDelivery.jsx
                } else {
            if (res.status === 400 && res.data.message) {
                alert(res.data.message)
            } else {
                alert ("Failed to place order")
            }   
            }  
            }

            if (deliveryMode === 'delivery'){
                if (!navigator.geolocation){
                    alert('Geolocation not supported')
                    return
                }

                navigator.geolocation.getCurrentPosition(async (position) => {
                    data.location = {latitude: position.coords.latitude, longitude: position.coords.longitude}
                await sendOrder();
                   
            }, () => {
                alert("Failed to get location");
            });


            } else {
                await sendOrder();                
            }

        } catch (error) {
            if (error.response?.status === 400 && error.response?.data?.message){
                alert(error.response.data.message)
            } else {
                console.error("Error placing order:", error)
                alert("An error occured while placing the order")
            }
        }
    }

    useEffect(()=>{
        console.log(cartItems);
    }, [cartItems])


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
        food_list, setFoodList, url, cartItems, setCartItems, addToCart, removeFromCart, fetchFoodList, placeOrder, updateCartComment
    };
    
    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider
