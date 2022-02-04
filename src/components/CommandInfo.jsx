import '../scss/main.scss';

function CommandInfo({ info }) {

    return (
        <li className='command-item'>
            <h2>{info.name}</h2>    
            <p>{info.syntax}</p>
            <p>{info.description}</p>
        </li>
    );
}

export default CommandInfo;