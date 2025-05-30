ReadableStreamDefaultController
import './Loginsignup.css'
import {Link} from 'react-router-dom';

import user_icon from '../assets/person.png'
import email_icon from '../assets/email.png'
import password_icon from '../assets/password.png'

const Loginsignup = () => {
    return (
        <div className='container' >
            <div className="header">
                <div className="text">Food For All</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                <div className="input">
                    <img src={user_icon} alt="" />
                    <input type="text" placeholder="Name"/>
                </div>
                <div className="input">
                    <img src={email_icon} alt="" />
                    <input type="email" placeholder="Email Id"/>
                </div>
                <div className="input">
                    <img src={password_icon} alt="" />
                    <input type="Password" placeholder="Password"/>
                </div>
            </div>
            <div className="Forgot-password">Forgotten your password? <span>Click here</span></div>
            <div className="submit-container">
                <Link to = "/signup" className="submit">Sign Up</Link>
                <div className="submit">Login</div>
            </div>


        </div>
    )
}

export default Loginsignup