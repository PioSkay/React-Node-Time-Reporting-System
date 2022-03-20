import classes from './ElementsFilter.module.css';

const ElementsFilter = (props) => {
    return (
        <div className={classes.elementsFilter}>
            <div className={classes.elementsFilter__control}>
                <h2>Enter the date</h2>
                <input type='date' value={props.date} onChange={props.newDate}></input>
            </div>
        </div>
    );
}

export default ElementsFilter;