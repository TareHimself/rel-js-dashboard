import '../../scss/main.scss';
import { VscColorMode } from 'react-icons/vsc';

function DashboardColorInput({ name ,value , onValueChange}) {

    function onColorChanged(event)
    {
        const color = event.target.value;

        onValueChange(color);
    }

    return (
        <div className='dashboard-setting'>
            <h2>{name}</h2>
            <div className='dashboard-setting-color' style={{backgroundColor : value }}>
              <div className='dashboard-setting-color-background' />
              <VscColorMode />
              <input type="color" value={value} onChange={onColorChanged}/>
            </div>
        </div>
    );
}

export default DashboardColorInput;