import { useEffect, useState } from 'react'
import axios from 'axios'
import DriverHeader from './DriverHeader';
import Upload from '../../assets/upload_area.jpg';
import PhoneIcon from '../../assets/phone.png';

const DriverProfile = () => {
    const driverId = localStorage.getItem("driverId");
    const [driver, setDriver] = useState(null)
    const [newImage, setNewImage] = useState(null);
    const [about, setAbout] = useState('')
    const [editingPhone, setEditingPhone] = useState(false);
    const [phone, setPhone] = useState('');
    const [deliveredCount, setDeliveredCount] = useState(0);

    useEffect(() => {
        const fetchDriver = async () => {
            const res = await axios.get(`http://localhost:4000/api/drivers/${driverId}`);
            setDriver(res.data.driver);
            setAbout(res.data.driver.about || '')
            setPhone(res.data.driver.phone || '')
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

    const handlePhoneSave = async () => {
        try {
            const res = await axios.put(`http://localhost:4000/api/drivers/${driverId}/phone`, { phone });
            if (res.data.success) {
                setDriver(prev => ({ ...prev, phone }));
                setEditingPhone(false);
            }
        } catch (error) {
            alert('Failed to update phone number');
        }
    };

    if (!driver) return <p>Loading driver profile...</p>

    const handleAboutChange = async (e) => {
        const newAbout = e.target.value;
        setAbout(newAbout)
        setTimeout(async () => {
            try {
                await axios.put(`http://localhost:4000/api/drivers/${driverId}/about`, {
                    about: newAbout
                })
            } catch (error) {
                console.error('Failed to save about:', error)
            }
        }, 1000)
    }

    return (
        <div>
            <DriverHeader />
            <div className='driver-pfp-container'>
                <div className='driver-box' style={{background: 'rgb(208, 244, 196)', borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '32px 40px', minWidth: 900, maxWidth: 1100}}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <p className='profile-title' style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Volunteer Delivery Rider</p>
                        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                            <img src={PhoneIcon} alt="Phone" style={{ width: 22, height: 22, filter: 'invert(0.3)', cursor: 'pointer' }} />
                            {editingPhone ? (
                                <>
                                    <input
                                        type="text"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        style={{ fontSize: 16, padding: '4px 8px', borderRadius: 6, border: '1px solid #b7e4c7', marginRight: 8 }}
                                    />
                                    <button onClick={handlePhoneSave} style={{ fontSize: 15, padding: '4px 12px', borderRadius: 6, background: '#b7e4c7', border: 'none', color: '#37512f', fontWeight: 600, cursor: 'pointer' }}>Save</button>
                                    <button onClick={() => { setEditingPhone(false); setPhone(driver.phone); }} style={{ fontSize: 15, padding: '4px 12px', borderRadius: 6, background: '#eee', border: 'none', color: '#333', fontWeight: 500, cursor: 'pointer', marginLeft: 4 }}>Cancel</button>
                                </>
                            ) : (
                                <span style={{ fontSize: 16, color: '#37512f', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setEditingPhone(true)}>{driver.phone}</span>
                            )}
                        </div>
                    </div>
                    <div className='profile-content' style={{gap: 40}}>
                        <div className='profile-left' style={{minWidth: 180}}>
                            <div className='pfp-section'>
                                <label htmlFor='profileImage'>
                                    <img className='pfp' style={{width: 180, height: 180, objectFit: 'cover', border: 'none', marginBottom: 12}} src={newImage ? URL.createObjectURL(newImage) : (driver.profilePicUrl ? `http://localhost:4000${driver.profilePicUrl}` : Upload)} alt="" />
                                </label>
                                {/*<input onChange={(e)=>setNewImage(e.target.files[0])} type='file' id='profileImage' hidden required />
                                {newImage && (<button></button>)}*/}
                            </div>
                        </div>
                        <div className="profile-right">
                            <h2 className='driver-name' style={{ marginBottom: 4 }}>{driver.name}</h2>
                            <p className='vehicle-info' style={{ margin: 0 }}>{driver.vehicleType}, {driver.licensePlate}</p>
                            <p className='deliveries' style={{ margin: 0 }}>Meals Delivered: {deliveredCount}</p>
                            <div className='about-section'>
                                <textarea id='about' value={about} onChange={handleAboutChange} className='about-textarea' placeholder="Tell us why you volunteered!" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DriverProfile;


