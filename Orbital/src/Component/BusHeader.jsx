import './BusMain.css'
import profile from '../assets/profile icon.png';

function BusHeader(){
    const handleClick = (e) => e.target.style.display = "none";
    return(
        <header className='busheader'>
            <img className='profile-icon' onClick={(e)=>handleClick(e)} src={profile}/>
            <h1 className='title'>FoodForAll</h1>
        </header>
    );
}

export default BusHeader;