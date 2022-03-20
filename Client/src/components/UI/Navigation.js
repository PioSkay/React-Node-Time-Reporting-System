import { useContext  } from "react";
import { Link } from 'react-router-dom';
import AuthContext from "../Auth/AuthContext";

import classes from './Navigation.module.css';

const Navigation = () => {
    const authCtx = useContext(AuthContext);
    const isLoggedIn = authCtx.isLoggedIn;
    const logoutHandler = () => {
        authCtx.logout();
    };
    return (
        <header className={classes.header}>
            <Link to='/'>
                <div className={classes.logo}>Time Reporting System</div>
            </Link>
            <nav>
                <ul>
                    {!isLoggedIn && (
                        <li>
                            <Link to='/auth'><button type="button">Login</button></Link>
                        </li>
                    )}
                    {isLoggedIn && (
                        <li>
                            <Link to='/'>Home</Link>
                        </li>
                    )}
                    {isLoggedIn && (
                        <li>
                            <Link to='/enter'>Enter</Link>
                        </li>
                    )}
                    {isLoggedIn && (
                        <li>
                            <button onClick={logoutHandler}>Logout</button>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Navigation;