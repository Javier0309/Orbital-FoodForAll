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

    const momobuffetdiner = [{id: 1, name: "Momo's Buffet Diner", stars: 4, isOpen:true, items:3}, 
        {id: 2, name:'ZBanana', calories: 44}, {id: 3, name: 'Cherry', calories: 40 }, {id: 4, name: 'Date', calories: 19}, {id: 5, name: 'Elderberry', calories: 95}];
    return(
        <>
            <CustHeader/>

            <hr></hr>
            <Restaurant name="Momo's Buffet Diner" stars={4} isOpen={true} items={3}/>
            <FoodCard/> 
            <FoodCard/>
            <FoodCard/>
            <hr></hr>

            <Restaurant name="International Hotel" stars={5} isOpen={true} items={3}/>
            <FoodCard/> 
            <FoodCard/>
            <FoodCard/>
            <hr></hr>

            <Restaurant name="Marvin's Feast" stars={5} isOpen={true} items={3}/>
            <FoodCard/> 
            <FoodCard/>
            <FoodCard/>
            <hr></hr>

{/*}
            {items > 0 && isOpen && <Restaurant name="International Hotel" stars={4} isOpen={true} items={3}/>}
            <FoodCard/> 

            {grah.length > 0 && <List items={fruits} category="Fruits"/>}
            {desserts.length > 0 && <List items={desserts} category="Desserts"/>}
            <Student name='Elliot' age={30} isStudent={true}/> */}

    
        </>
    );
}

export default CustMain;
