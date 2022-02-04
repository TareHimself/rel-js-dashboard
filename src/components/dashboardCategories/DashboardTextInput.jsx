

import '../../scss/main.scss';

function DashboardTextInput({ name, value , onValueChange}) {

    function handleTextChange(event){
        if(event)
        {
            onValueChange(event.target.value);
        }
    }
    return (
        <div className='dashboard-setting'>
            <h2>{name}</h2>
            <input type='text' className='dashboard-setting-text' value={value} onChange={handleTextChange}/>
        </div>
    );
}

export default DashboardTextInput;