import './CustMain.css'

import CustHeader from "./CustHeader.jsx";
//import Footer from "./Footer.jsx"
import FoodCard from "./FoodCard.jsx";
import Restaurant from "./Restaurant.jsx";


//import Counter from "./Counter.jsx";
//import MyCompo from "./MyCompo.jsx";
//import Counter from "./Counter.jsx";
//import ColorPicker from "./ColorPicker.jsx";

function CustMain() {
    return(
        <>
        <div className="app"> 
            <CustHeader/>
            <FoodCard/>
        </div>
    
        </>
    );
}

export default CustMain;
