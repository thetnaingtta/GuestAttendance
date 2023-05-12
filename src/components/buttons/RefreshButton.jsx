
import classes from "./Button.module.css";
import SyncIcon from "../Icons/SyncIcon";

const RefreshButton = props => {
    const { OnClick, label } = props;
    return <button className={classes.icon} onClick={() => OnClick()} >
        <span className={classes.CartIcon}>
            <SyncIcon />
        </span>
        <span>{label}</span>
    </button>
};


export default RefreshButton;

