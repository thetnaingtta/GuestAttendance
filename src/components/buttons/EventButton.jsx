import classes from "./Button.module.css";

const EventButton = props => {
    const { guest, OnClick, label } = props;
    return <button className={classes.button} onClick={() => OnClick(guest)} >
        {/* <span className={classes.CartIcon}>
            <SyncIcon />
        </span> */}
        <span>{label}</span>
    </button>
};


export default EventButton;

