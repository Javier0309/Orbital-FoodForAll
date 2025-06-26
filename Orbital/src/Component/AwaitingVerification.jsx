import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function AwaitingVerification(){
    const navigate = useNavigate();
    const businessId = localStorage.getItem('businessId');

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                if (!businessId) return;
                const res = await axios.get(`http://localhost:4000/api/signup/business-by-email/${localStorage.getItem('email')}`)
                if (res.data.success && res.data.business?.isVerified) {
                    clearInterval(interval)
                    navigate("/busmain")
                }

            } catch (error) {
                console.error("Verification check error: ", error);
            }
        }, 1000)

        return () => clearInterval(interval);
    }, [navigate, businessId])

    return (
        <div className='verification-container'>
            <h1>Thanks for signing up!</h1>
            <p>Your business details have been submitted.</p>
            <p>We will review and approve your account shortly.</p>
            <p>Once approved, you will be redirected automatically</p>
        </div>
    )
}

export default AwaitingVerification;