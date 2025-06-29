import { useEffect, useState} from 'react'
import axios from 'axios'
import DriverHeader from './DriverHeader';
import Upload from '../../assets/upload_area.jpg';

const DriverProfile = () => {
    const driverId = localStorage.getItem("driverId"); 
    const [driver, setDriver] = useState(null)
    const [newImage, setNewImage] = useState(null);

    useEffect(() => {
        const fetchDriver = async () => {
            const res = await axios.get(`http://localhost:4000/api/drivers/${driverId}`);
            setDriver(res.data.driver);
        };
        fetchDriver();
    }, [driverId])

    const handleUpload = async () => {
        if (!newImage) return;

        const formData = new FormData();
        formData.append("profilePic", newImage);

        const res = await axios.post(`http://localhost:4000/api/drivers/${driverId}/upload-profile-pic`, formData)
        if (res.data.success){
            setDriver(prev => ({ ...prev, profilePicUrl: res.data.profilePicUrl }))
            setNewImage(null);
        }
    }
    if (!driver) return <p>Loading driver profile...</p>

    return (
        <div>
            <DriverHeader/>
            <p>Volunteer Delivery Rider</p>
            <div className="add-img-upload flex-col">
                <p>Upload Image</p>
                <label htmlFor='profileImage'>
                <img src={newImage?URL.createObjectURL(newImage):(driver.profilePicUrl ? `http://localhost:4000${driver.profilePicUrl}` : Upload)} alt="" />
                </label>
                <input onChange={(e)=>setNewImage(e.target.files[0])} type='file' id='profileImage' hidden required />
            </div>
            <h2>{driver.name}</h2>
            <p>{`${driver.vehicleType}, ${driver.licensePlate}`}</p>
            <p>Meals Delivered: {driver.totalDeliveries}</p>
            <p>{driver.about}</p>
        </div>
    )
}

export default DriverProfile;


