import React, { useState } from "react";


const DateContext = React.createContext({
    date: '2000-01-01',
    changeDate: (date) => {}
});

export const DateContextProvider = (props) => {
    const dateData = localStorage.getItem('date');
    let initiadate;
    if(dateData)
    {
        initiadate = dateData;
    }   
    const  [date, setdate] = useState(initiadate);

    const dateHandler = (date) => {
        setdate(date);
        localStorage.setItem('date', date);
    };

    const contextValue = {
        date: date,
        changeDate: dateHandler
    };

    return (
        <DateContext.Provider value={contextValue}>
            {props.children}
        </DateContext.Provider>
    );
};

export default DateContext;