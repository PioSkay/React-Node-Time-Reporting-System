import ElementContainer from "./ElementContainer";
import MainBoard from "./MainBoard";
import ElementsFilter from "./ElementsFilter";
import { useState, useContext, useEffect } from "react";
import classes from './Home.module.css';
import AuthContext from '../Auth/AuthContext';
import DateContext from "./DateContextProvider";

const Home = () => {
    const authCtx = useContext(AuthContext);
    const date = useContext(DateContext);

    const [data, setData] = useState([]);
    const [workTime, setWorkTime] = useState(0);

    const dateUpdater = async (date) => {
        const response = await fetch("http://localhost:5555/home_data", {
            method: 'POST',
            body: JSON.stringify({
                token: authCtx.token,
                date: date
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if(response.status === 401) {
            authCtx.logout();
        }
        const data = await response.json();
        setData(data.entries);
    }

    const onNewDate = async (event) => {
        event.preventDefault();
        dateUpdater(event.target.value);
        date.changeDate(event.target.value);
    }
    const onRefresh = async () => {
        dateUpdater(date.date);
        const response = await fetch("http://localhost:5555/work_time", {
            method: 'POST',
            body: JSON.stringify({
                token: authCtx.token
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if(response.status === 401) {
            authCtx.logout();
        }
        const data = await response.json();
        setWorkTime(parseInt(data.time));
    }
    useEffect(async () => {
        await onRefresh();
    }, [])
    return (
        <MainBoard className={classes.home}>
            <h2 className={classes.middle}>You have worked for {workTime} [min]</h2>
            <ElementsFilter date={date.date} newDate={onNewDate} />
            <ElementContainer data={data} onDelete={onRefresh}/>
        </MainBoard>
    );
}

export default Home;