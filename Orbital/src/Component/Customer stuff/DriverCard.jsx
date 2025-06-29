import { useEffect, useState} from 'react'
import axios from 'axios'
import Upload from '../../assets/upload_area.jpg';

const DriverCard = ({driverId}) => {
    const [driver, setDriver] = useState(null)

    useEffect(() => {
        const fetchDriver = async () => {
            const res = await axios.get(`http://localhost:4000/api/drivers/${driverId}`);
            setDriver(res.data.driver);
        };
        fetchDriver();
    }, [driverId])

    if (!driver) return <p>Loading driver profile...</p>

    return (
        <div>
            <div className='driver-pfp-card'>
                <div className='driver-box'>
                    <p className='profile-title'>Volunteer Delivery Rider</p>
                        <div className='profile-content'>
                            <div className='profile-left'>
                                <div className='pfp-section'>
                                    <label htmlFor='profileImage'>
                                    <img className='pfp' src={driver.profilePicUrl ? `http://localhost:4000${driver.profilePicUrl}` : Upload} alt="" />
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
                            <p className='about-text'>{driver.about || ''}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}

export default DriverCard;


