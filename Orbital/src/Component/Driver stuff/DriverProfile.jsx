import { useEffect, useState} from 'react'
import axios from 'axios'
import DriverHeader from './DriverHeader';
import Upload from '../../assets/upload_area.jpg';

const DriverProfile = () => {
    const driverId = localStorage.getItem("driverId"); 
    const [driver, setDriver] = useState(null)
    const [newImage, setNewImage] = useState(null);
    const [about, setAbout] = useState('')

    useEffect(() => {
        const fetchDriver = async () => {
            const res = await axios.get(`http://localhost:4000/api/drivers/${driverId}`);
            setDriver(res.data.driver);
            setAbout(res.data.driver.about || '')
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

    const handleSaveAbout = async () => {
        try {
            const res = await axios.put(`http://localhost:4000/api/drivers/${driverId}/about`, {
                about: editedAbout
            })
            if (res.data.success) {
                setDriver(prev => ({ ...prev, about: editedAbout }))
                setIsEditing(false)
            }
        } catch (error) {
            console.error('Error updating about:', error)
        }
    }

    const handleAboutChange = async (e) => {
        const newAbout = e.target.value;
        setAbout(newAbout)

        setTimeout(async () => {
            try {
                await axios.put(`http://localhost:4000/api/drivers/${driverId}/about`, {
                    about:newAbout
                })
            } catch (error) {
                console.error('Failed to save about:', error)
            }
        }, 1000)
    }

    
    return (
        <div>
            <DriverHeader/>
            <div className='driver-pfp-container'>
                <div className='driver-box'>
                    <p className='profile-title'>Volunteer Delivery Rider</p>
                        <div className='profile-content'>
                            <div className='profile-left'>
                                <div className='pfp-section'>
                                    <label htmlFor='profileImage'>
                                    <img className='pfp' src={newImage?URL.createObjectURL(newImage):(driver.profilePicUrl ? `http://localhost:4000${driver.profilePicUrl}` : Upload)} alt="" />
                                    </label>
                                    {/*<input onChange={(e)=>setNewImage(e.target.files[0])} type='file' id='profileImage' hidden required />
                                    {newImage && (<button></button>)}*/}
                                </div>
                            </div>
                    <div className="profile-right">
                        <h2 className='driver-name'>{driver.name}</h2>
                        <p className='vehicle-info'>{driver.vehicleType}, {driver.licensePlate}</p>
                        <p className='deliveries'>Meals Delivered: {driver.totalDeliveries}</p>
                        <div className='about-section'>
                            <textarea id='about' value={about} onChange={handleAboutChange} className='about-textarea' placeholder="Tell us why you volunteered!"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}

export default DriverProfile;


