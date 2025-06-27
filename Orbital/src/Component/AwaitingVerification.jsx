import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function AwaitingVerification(){
    const navigate = useNavigate();
    const email = localStorage.getItem('email');
    const userType = localStorage.getItem('userType');

    useEffect(() => {
        if (!email || !userType ){
            console.warn('Missing email or userType')
            return
        }

        const interval = setInterval(async () => {
            try {
                const normalizedType = userType === 'F&B business' ? 'business' : 'customer'
                const url = normalizedType === 'business' 
                ? `http://localhost:4000/api/signup/business-by-email/${localStorage.getItem('email')}`
                : `http://localhost:4000/api/signup/customer-by-email/${localStorage.getItem('email')}`

        
                const res = await axios.get(url);
                const doc = res.data[normalizedType]
                if (res.data.success && doc?.isVerified) {
                    clearInterval(interval)
                    
                    navigate (normalizedType === 'business' ? "/busmain" : "/custmain")
                }

            } catch (error) {
                console.error("Verification check error: ", error);
            }
        }, 3000)

        return () => clearInterval(interval);
    }, [navigate, email, userType])

    return (
        <div className='verification-container'>
            <h1>Thanks for signing up!</h1>
            <p>Your details have been submitted.</p>
            <p>We will review and approve your account shortly.</p>
            <p>Once approved, you will be redirected automatically</p>
        </div>
    )
}

export default AwaitingVerification;