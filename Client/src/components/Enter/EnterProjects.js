import AuthContext from "../Auth/AuthContext";
import { useEffect, useState, useContext } from "react";
import classes from './../Auth/AuthForm.module.css';

const EnterProjects = ({onCodeChange, defaultValue}) => {
    const [elements, setElements] = useState([]);
    const authCtx = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("http://localhost:5555/enter", {
                method: 'POST',
                body: JSON.stringify({
                    token: authCtx.token
                }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log(response.status);
            if(response.status === 401) {
                authCtx.logout();
            }
            const data = await response.json();
            const ele = [{}];
            for(let i = 0; i < data.activity.length; i++) {
                if(data.activity[i].code === defaultValue) {
                    let x = {
                        target: {
                            value: data.activity[i].code
                        } 
                    };
                    onCodeChange(x);
                }
                ele.push({data: data.activity[i].code, default: data.activity[i].code === defaultValue});
            }
            setElements(ele);
        }
        fetchData();
    }, [defaultValue])
    return (
        <select onChange={onCodeChange} required>
            {elements.map((ele, i) => {
                if(ele.default === true) {
                    return <option key={i} selected>{ele.data}</option>
                } else {
                    return <option key={i}>{ele.data}</option>
                }
            })}
        </select>
    )
}

export default EnterProjects;