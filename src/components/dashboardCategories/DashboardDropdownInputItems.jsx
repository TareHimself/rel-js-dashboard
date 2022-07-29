import '../../scss/main.scss';
function DashboardDropdownInputItems({ item, isSelected, onItemSelected, onItemUnselected, displayDataFunction, displayDataFunctionPayload }) {

    let displayValue = item;

    if (displayDataFunction) {
        displayValue = displayDataFunction(item, displayDataFunctionPayload);
    }

    return (
        <option value={item} className='dashboard-setting-dropdown-item' >
            {displayValue}
        </option>
    );
}

export default DashboardDropdownInputItems;