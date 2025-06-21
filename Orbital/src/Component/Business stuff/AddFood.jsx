import { useState, useEffect } from 'react';
import Plus from '../../assets/plus.png';
import Minus from '../../assets/minus.png';
import Upload from '../../assets/upload_area.jpg';
import axios from "axios"
import { toast } from 'react-toastify';

function AddFood(props) {
    const url = "http://localhost:4000";
    const [itemCount, setItemCount] = useState(0);
    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name:"",
        desc:"",
        quantity:0,
    })

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData(data=>({...data,[name]:value}))
    }  

    const cancelHandler = (e) => {
        setData({
            name:"",
            desc:"",
            quantity:0,
        })
        setImage(false)
        props.setTrigger(false)
    }

    const onSubmitHandler = async (e) => {
       e.preventDefault(); 
       const formData = new FormData();
       formData.append("name", data.name)
       formData.append("desc", data.desc)
       formData.append("quantity", Number(data.quantity))
       formData.append("image", image)
       formData.append("businessId", localStorage.getItem("businessId"))
       console.log("businessId in localStorage:", localStorage.getItem("businessId"));
       const response = await axios.post(`${url}/api/food/add`,formData)  //since created Add using post
       if (response.data.success) { //to reset after save
            setData({
                name:"",
                desc:"",
                quantity:0,
            })
            setImage(false)
            toast.success(response.data.message)
            props.onAdd?.();
            props.setTrigger(false)
       } else {
            toast.error(response.data.message)
       }
    }

    useEffect(() => {
        setData((prev) => ({ ...prev, quantity: itemCount}))
    }, [itemCount])


    return (props.trigger) ? (
        <div className="add-food-bg">
            <div className="add-food-inner">
                <h2>Add food to donate</h2>
                <form className='flex-col' onSubmit={onSubmitHandler}>
                    <div className='LHS'>
                    <div className="add-img-upload flex-col">
                        <p>Upload Image</p>
                        <label htmlFor='image'>
                            <img src={image?URL.createObjectURL(image):Upload} alt="" />
                        </label>
                        <input onChange={(e)=>setImage(e.target.files[0])} type='file' id='image' hidden required />
                    </div>

                    <div className='food-qty'>
                        <img onClick={()=>setItemCount(prev=> Math.max(prev-1, 0))} src={Minus} alt=""/>
                        <div>{itemCount}</div>
                        <img onClick={()=>setItemCount(prev=>prev+1)} src={Plus} alt=""/>
                    </div>
                    </div>

                    <div className='RHS'>
                    <div className="add-product-name flex-col">
                        <p>Product name</p>
                        <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type here' required/>
                    </div>

                    <div className="add-product-desc flex-col">
                        <p>Product Description (eg. Ingredients)</p>
                        <textarea onChange={onChangeHandler} value={data.desc} type="text" name='desc' rows='6' placeholder='Write content here' required/>
                    </div>

                    <div className='time'>
                        <div className='time1'>
                        <p>Cooked at:</p>
                        <button>Add cooked time</button>
                        </div>
                        <div className='time2'>
                        <p>Consume by:</p>
                        <button>Add consume by time</button>
                        </div>
                        </div>
                    </div>
                    
                
                <br/>
                
                <button type='submit' className="save-btn">Add</button>
                
                { props.children }
                </form>
                <button className="close-btn" onClick={cancelHandler}>Cancel</button>
                <p>Food items will be removed from listing after their consume by time</p>
            </div>
        </div>
    ) : "";
}

export default AddFood;