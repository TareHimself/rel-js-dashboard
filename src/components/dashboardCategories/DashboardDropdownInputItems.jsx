import '../../scss/main.scss';
import { MdRadioButtonUnchecked } from 'react-icons/md';
import { IoMdRadioButtonOn } from 'react-icons/io';

function DashboardDropdownInputItems({ item, isSelected, onItemSelected, onItemUnselected, displayDataFunction, displayDataFunctionPayload }) {

    let displayValue = item;

    if (displayDataFunction) {
        displayValue = displayDataFunction(item, displayDataFunctionPayload);
    }

    function toggleSelectedState() {
        if (isSelected) {
            onItemUnselected(item);
        }
        else {
            onItemSelected(item);
        }
    }
    return (
        <option value={item} className='dashboard-setting-dropdown-item' >
            {displayValue}
        </option>
    );
}

export default DashboardDropdownInputItems;