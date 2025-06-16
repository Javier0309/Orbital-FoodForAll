import { createContext, useState, useEffect } from "react"
import axios from "axios";

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

    const url = "http://localhost:4000";
    const [food_list,setFoodList] = useState([])
    const contextValue = {
        food_list, setFoodList, url
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

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider
