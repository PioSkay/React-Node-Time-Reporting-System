import { useState, useRef, useContext } from 'react';
import classes from './AuthForm.module.css';
import AuthContext from './AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
    const history = useNavigate();
    const usernameInput = useRef();
    const passwordInput = useRef();
    const passwordRepInput = useRef();
    const authContext = useContext(AuthContext);

    const [login, switchLogin] = useState(true);
    const [loading, switchLoading] = useState(false);

    const switchAuthMode = () => {
        switchLogin((status) => !status);
    }
    
    const submitHandler = (event) => {
        event.preventDefault();
        const username = usernameInput.current.value;
        const password = passwordInput.current.value;
        let rep_password = "";
        switchLoading(true);
        let url;
        if(login)
        {
            url = "http://localhost:5555/login";
        }
        else
        {
            rep_password = passwordRepInput.current.value;
            url = "http://localhost:5555/register";
        }
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                username: username,
                password: password,
                repeat_password: rep_password,
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            if(res.ok) {
                return res.json();
            } else {
                return res.json().then((data) => {
                    throw new Event(data.json());
                });
            }
        }).then((data) => {
            authContext.login(data.token);
            history('/');
        }).catch((err) => {
            alert('Could not authenticate!');
            switchLoading(false);
        });
    }
    return (
        <section className={classes.auth}>
            <h1>{login ? 'Login' : 'Register'}</h1>
            <form onSubmit={submitHandler}>
                <div className={classes.element}>
                    <label htmlFor='login'>
                        Username
                    </label>
                    <input required ref={usernameInput}>
                    </input>
                </div>
                <div className={classes.element}>
                    <label>
                        Password
                    </label>
                        <input type='password' required ref={passwordInput}>
                    </input>
                </div>
                {!login && (
                    <div className={classes.element}>
                        <label>
                            Repeat Password
                        </label>
                        <input type='password' required ref={passwordRepInput}>
                    </input>
                    </div>
                )}
                <div className={classes.element}>
                    {!loading && (
                        <button>
                            {login ? 'Login' : 'Register'}
                        </button>
                    )}
                    {loading && (
                        <div>
                            Loading
                        </div>
                    )}
                </div>
                <div className={classes.element}>
                    <button type='button' className={classes.switch} onClick={switchAuthMode}>
                        {login ? 'Create new account' : 'Login with existing account'}
                    </button>
                </div>
            </form>
        </section>
    );
}

export default AuthForm;