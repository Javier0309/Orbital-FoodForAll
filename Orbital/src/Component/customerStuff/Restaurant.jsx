import "./CustMain.css" ;

function Restaurant(props){

    return(
        <div className='restaurant'>
            <p>{props.name} ................... {props.stars} stars
            . . . . . {props.isOpen ? "Open" : "Closed"}</p>
        </div>
    )
}


export default Restaurant;