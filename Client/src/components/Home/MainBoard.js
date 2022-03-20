import './MainBoard.css';

const MainBoard = (props) => {
    const element = 'MainBoard ' + props.className;
    return <div className={element}>{props.children}</div>
}

export default MainBoard;