import { useContext, useEffect, useRef, useState } from "react";
import classes from './../Auth/AuthForm.module.css';
import AuthContext from './../Auth/AuthContext';
import EnterProjects from "./EnterProjects";
import { useNavigate, useParams } from 'react-router-dom';
import DateContext from "../Home/DateContextProvider";

const EnterForm = () => {
    const dateCxt = useContext(DateContext);
    const params = useParams();
    const isEditing = params.ID != null;
    const authContext = useContext(AuthContext);
    const [optionalParameters, setOpetionalParameters] = useState({});
    const dateInput = useRef();
    const timeInput = useRef();
    const codeInput = useRef();
    const descriptionInput = useRef();
    const history = useNavigate();
    const codeChangeHandler = (event) => {
        codeInput.current = event.target.value;
    }
    const submitHandler = (event) => {
        event.preventDefault();
        let URL = null;
        const dataPackage = {
            token: authContext.token,
            time: timeInput.current.value,
            date: dateInput.current.value,
            code: codeInput.current,
            description: descriptionInput.current.value
        }
        if(isEditing === true) {
            URL = 'http://localhost:5555/modify_data';
            dataPackage.id = parseInt(params.ID);
        } else {
            URL = 'http://localhost:5555/enter_data';
        }
        fetch(URL, {
            method: 'POST',
            body: JSON.stringify(dataPackage),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((status) => {
            if(status.ok){
                return true;
            } else {
                return false;
            }
        }).then((data) => {
            if(data === true) {
                history("/");
            } else {
                throw Error('Invalid request');
            }
        })  
    }
    useEffect(() => {
        if(isEditing === true) {
            const fetchData = async () => {
                const response = await fetch("http://localhost:5555/fetch_data", {
                    method: 'POST',
                    body: JSON.stringify({
                        token: authContext.token,
                        id: parseInt(params.ID)
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                console.log(response);
                if(response.status === 401) {
                    authContext.logout();
                } else if(response.status === 400) {
                    console.log('ss');
                    history("/");
                }
                const data = await response.json();
                setOpetionalParameters(data);
            }
            fetchData();
        } else {
            setOpetionalParameters({date: dateCxt.date});
        }
    }, [isEditing]);
    
    return (
        <section className={classes.auth}>
            <h1>Enter data</h1>
            <form onSubmit={submitHandler}>
                <div className={classes.element}>
                    <label htmlFor='login'>
                        Date
                    </label>
                    <input type='date' required ref={dateInput} defaultValue={optionalParameters.date}>
                    </input>
                </div>
                <div className={classes.element}>
                    <label htmlFor='projects'>
                        Projects
                    </label>
                    <EnterProjects onCodeChange={codeChangeHandler}  defaultValue={optionalParameters.code} />
                </div>
                <div className={classes.element}>
                    <label>
                        Time
                    </label>
                        <input type='number' min='1' max='100' required ref={timeInput} defaultValue={optionalParameters.time}>
                    </input>
                </div>
                <div className={classes.element}>
                    <label>
                        Description
                    </label>
                        <input ref={descriptionInput} defaultValue={optionalParameters.description}>
                    </input>
                </div>
                <div className={classes.element}>
                    {!isEditing && (<button>Add</button>)}
                    {isEditing && (<button>Edit</button>)}
                </div>
            </form>
        </section>
    );
}

export default EnterForm;