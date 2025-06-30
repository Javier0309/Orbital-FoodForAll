
import './BusMain.css';
import AddFood from './AddFood.jsx';
import BusHeader from "./BusHeader.jsx";
import { useEffect,useState } from 'react'
import axios from "axios"
import { toast } from 'react-toastify'

const Menu = () => {
    const url = "http://localhost:4000"
    const [popUp, setPopUp] = useState(false);
    const [menu, setMenu] = useState([]);
    const fetchMenu = async () => {
        const businessId = localStorage.getItem('businessId')
        const response = await axios.get(`${url}/api/food/list/${businessId}`)
        console.log(response.data);
        if (response.data.success) {
            setMenu(response.data.data)
        } else {
            toast.error("Error")
        }
    }
    
    const handleRemove = async (id) => {
        const confirm = window.confirm("Are you sure you want to remove this item?");
        if (!confirm) return;

        try {
            const response = await axios.post(`${url}/api/food/remove`, {id})
            if (response.data.success){
                toast.success('Item removed');
                fetchMenu(); //refresh menu
            } else {
                toast.error('Failed to remove')
            }
        } catch (error) {
            console.error(error)
            toast.error('Error removing item')
        }
    }

    useEffect(() => {
        fetchMenu();
    }, [])

    return (
        <>
            <BusHeader/>
                <div className="busmenu">
                <p>
                <button onClick={() => setPopUp(true)}>Add food to donate</button>
            <AddFood trigger={popUp} setTrigger={setPopUp} onAdd={fetchMenu}/>  {/*props for AddFood.jsx*/} 
            <div className='list add flex-col'>
                <p>Food Offered</p>
                <div className="list-table">
                    {menu.map((item,index)=>{
                        return(
                            <div key={index}>
                                <div className="flex-col">
                                <div className='LHS'>
                                    <div className="add-img-upload flex-col">
                                        <img src={`${url}/uploads/` +item.image} alt="" />
                                    </div>
                        
                                    <div className='food-qty-menu'>
                                        <p>{item.quantity}</p>
                                    </div>
                                </div>
                        
                                <div className='RHS'>
                                    <div className="add-product-name flex-col">
                                        <h3>{item.name}</h3>
                                    </div>
                        
                                    <div className="add-product-desc flex-col">
                                        <h4>Ingredients</h4>
                                        <p>{item.desc}</p>
                                    </div>
                        
                                    <div className='time'>
                                        <div className='time1'>
                                            <p>Cooked at: {new Date(item.cookedAt).toLocaleString()}</p>
                                        </div>
                                        <div className='time2'>
                                            <p>Consume by: {new Date(item.consumeBy).toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className='remove'>
                                        <button onClick={() => handleRemove(item._id)}>Remove</button>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            </p></div>
        </>
    )
}

export default Menu;