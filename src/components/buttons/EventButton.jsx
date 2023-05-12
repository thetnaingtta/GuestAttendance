import CartIcon  from "../Icons/CartIcon";
import classes from "./EventButton.module.css";

const EventButton = props => {
    const { guest, OnClick, label } = props;
    return <button className={classes.button} onClick={() => OnClick(guest)} >
        {/* <span className={classes.CartIcon}>
            <CartIcon />
        </span> */}
        <span>{label}</span>
    </button>
};


export default EventButton;

