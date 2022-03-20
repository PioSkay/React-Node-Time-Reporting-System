import Element from './Element.js';
import classes from './Home.module.css';

const ElementsContainer = (props) => {
    if(props.data.length === 0)
    {
        return (
            <h2 className={classes.message}>
                No data entered
            </h2>
        );
    }
    return (
        <div>
            {props.data.map((data, index) => {
                return (
                    <Element key={data.ID} data={data} onDelete={props.onDelete}/>
                )
            })}
        </div>
    );
}

export default ElementsContainer;