import '../../scss/main.scss';
import { MdRadioButtonUnchecked } from 'react-icons/md';
import { IoMdRadioButtonOn } from 'react-icons/io';

function DashboardDropdownInputItems({ item , isSelected ,onItemSelected , onItemUnselected , displayDataFunction , displayDataFunctionPayload }) {
    
    let displayValue = item;

    if(displayDataFunction)
    {
        displayValue = displayDataFunction(item,displayDataFunctionPayload);
    }

    function toggleSelectedState(){
        if(isSelected)
        {
            onItemUnselected(item);
        }
        else
        {
            onItemSelected(item);
        }
    }
    return (
        <div className='dashboard-setting-dropdown-content-item' onClick={toggleSelectedState}>
            <p>{displayValue}</p> { isSelected ? <IoMdRadioButtonOn color='green' /> : <MdRadioButtonUnchecked color='red'/>}
        </div>
    );
}

export default DashboardDropdownInputItems;