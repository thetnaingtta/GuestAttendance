import { Fragment } from "react";
import classes from "./Header.module.css";

const Header = props => {
    return <Fragment>
        <header className={classes.header} style={{ marginBottom: '20px' }}>
            <h1>Guest Attendance</h1>
        </header>
        <div></div>
    </Fragment>
};

export default Header;