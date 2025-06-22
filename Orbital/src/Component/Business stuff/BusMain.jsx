import './BusMain.css'

import BusHeader from "./BusHeader.jsx";
import BusOverlay from "./BusOverlay.jsx";
import Orders from './Orders.jsx';
//import Footer from "./Footer.jsx"
//import FoodCard from "./FoodCard.jsx";
//import Restaurant from "./Restaurant.jsx";
//import Counter from "./Counter.jsx";
//import MyCompo from "./MyCompo.jsx";
//import Counter from "./Counter.jsx";
//import ColorPicker from "./ColorPicker.jsx";

function BusMain() {

    return(
        <>
           <BusHeader/>
           <BusOverlay/>
           <Orders/>
        </>
    );
}

export default BusMain;
