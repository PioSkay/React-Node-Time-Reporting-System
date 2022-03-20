import MainBoard from "./MainBoard";
import DateElement from "./DateElement";
import classes from './Element.module.css';
import AuthContext from '../Auth/AuthContext';
import { useContext } from "react";
import { useNavigate } from 'react-router-dom';

const Element = (props) => {
    const authCtx = useContext(AuthContext);
    const history = useNavigate();

    const deleteHandler = async () => {
        const response = await fetch("http://localhost:5555/delete", {
            method: 'DELETE',
            body: JSON.stringify({
                token: authCtx.token,
                id: props.data.ID
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if(response.status === 401) {
            authCtx.logout();
        }
        props.onDelete();
    }

    const redirectHandler = () => {
        history(`/enter/${props.data.ID}`);
    }

    return (
        <MainBoard className={classes.element}>
            <DateElement date={props.data.date} />
            <table>
                <tbody>
                    <tr>
                        <th>Code</th>
                    </tr>
                    <tr>
                        <td>{props.data.code}</td>
                    </tr>
                </tbody>
            </table> 
            <table>
                <tbody>
                    <tr>
                        <th>Time</th>
                    </tr>
                    <tr>
                        <td>{props.data.time}</td>
                    </tr>
                </tbody>
            </table> 
            {props.data.description && (
                <table>
                    <tbody>
                        <tr>
                            <th>Description</th>
                        </tr>
                        <tr>
                            <td>{props.data.description}</td>
                        </tr>
                    </tbody>
                </table>       
            )}
            <div className={classes.controls}>
                <button className={classes.formbuttonRed} onClick={deleteHandler}>Delete</button>
                <button className={classes.formbutton} onClick={redirectHandler}>Edit</button>
            </div>
        </MainBoard>
    );
}

export default Element;