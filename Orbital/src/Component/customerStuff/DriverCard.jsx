import { useEffect, useState} from 'react'
import axios from 'axios'
import Upload from '../../assets/upload_area.jpg';
import PhoneIcon from '../../assets/phone.png';
import MessageIcon from '../../assets/message.png';
import { useNavigate } from 'react-router-dom';

const DriverCard = ({driverId}) => {            // props from TrackDelivery.jsx
    const [driver, setDriver] = useState(null)
    const [deliveredCount, setDeliveredCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDriver = async () => {
            const res = await axios.get(`http://localhost:4000/api/drivers/${driverId}`);
            setDriver(res.data.driver);
        };
        fetchDriver();
        // Fetch delivered orders count
        const fetchDelivered = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/api/order/driver/delivered/${driverId}`);
                const completedOrders = res.data.orders ? res.data.orders.filter(order => order.status === 'completed') : [];
                setDeliveredCount(completedOrders.length);
            } catch (error) {
                setDeliveredCount(0);
            }
        };
        fetchDelivered();
    }, [driverId])

    if (!driver) return <p>Loading driver profile...</p>

    return (
        <div>
            <div className='driver-pfp-card' style={{position: 'relative'}}>
                {/* Volunteer link at top right */}
                <div className='driver-box'>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24}}>
                        <p className='profile-title' style={{margin: 0}}>Volunteer Delivery Rider</p>
                        <a
                            href="/signup?rider=1"
                            style={{
                                color: '#2563eb',
                                textDecoration: 'underline',
                                fontWeight: 500,
                                fontSize: 16,
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                                marginLeft: 16
                            }}
                        >
                            Volunteer to be a Delivery Rider!
                        </a>
                    </div>
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
                        <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10}}>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', height: 80, justifyContent: 'space-between'}}>
                                <div>
                                    <h2 className='driver-name' style={{marginBottom: 4}}>{driver.name}</h2>
                                    <p className='vehicle-info' style={{margin: 0}}>{driver.vehicleType}, {driver.licensePlate}</p>
                                </div>
                                <p className='deliveries' style={{margin: 0}}>Meals Delivered: {deliveredCount}</p>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
                                {driver.phone && (
                                    <a
                                        href={`tel:${driver.phone}`}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            background: '#f4c7c1',
                                            boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                                            textDecoration: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s',
                                        }}
                                        title={`Call ${driver.name}`}
                                    >
                                        <img src={PhoneIcon} alt="Call" style={{width: 22, height: 22, filter: 'invert(0.3)'}} />
                                    </a>
                                )}
                                <button
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 40,
                                        height: 40,
                                        borderRadius: '50%',
                                        background: '#f4c7c1',
                                        boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s',
                                    }}
                                    title={`Message ${driver.name}`}
                                    onClick={() => navigate(`/message/${driver._id}`)}
                                >
                                    <img src={MessageIcon} alt="Message" style={{width: 22, height: 22, filter: 'invert(0.3)'}} />
                                </button>
                            </div>
                        </div>
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


